import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from 'react';
const PersonalInfoContext = createContext(null);
export const usePersonalInfo = () => {
    const context = useContext(PersonalInfoContext);
    if (!context) {
        throw new Error('usePersonalInfo must be used within a PersonalInfoProvider');
    }
    return context;
};
export const PersonalInfoProvider = ({ children }) => {
    const [personalInfo, setPersonalInfoState] = useState(() => {
        const savedInfo = localStorage.getItem('personalInfo');
        return savedInfo ? JSON.parse(savedInfo) : null;
    });
    const setPersonalInfo = useCallback((info) => {
        setPersonalInfoState(info);
        localStorage.setItem('personalInfo', JSON.stringify(info));
    }, []);
    const clearPersonalInfo = useCallback(() => {
        setPersonalInfoState(null);
        localStorage.removeItem('personalInfo');
    }, []);
    const isOnboardingComplete = !!personalInfo;
    return (_jsx(PersonalInfoContext.Provider, { value: {
            personalInfo,
            setPersonalInfo,
            clearPersonalInfo,
            isOnboardingComplete,
        }, children: children }));
};
export default PersonalInfoProvider;
