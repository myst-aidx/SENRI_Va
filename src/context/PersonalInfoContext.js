import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
const PersonalInfoContext = createContext(undefined);
export function PersonalInfoProvider({ children }) {
    const [personalInfo, setPersonalInfo] = useState(() => {
        const saved = localStorage.getItem('personalInfo');
        return saved ? JSON.parse(saved) : null;
    });
    const [isOnboardingComplete, setIsOnboardingComplete] = useState(() => {
        return localStorage.getItem('onboardingComplete') === 'true';
    });
    useEffect(() => {
        if (personalInfo) {
            localStorage.setItem('personalInfo', JSON.stringify(personalInfo));
            localStorage.setItem('onboardingComplete', 'true');
            setIsOnboardingComplete(true);
        }
    }, [personalInfo]);
    const clearPersonalInfo = () => {
        setPersonalInfo(null);
        localStorage.removeItem('personalInfo');
        localStorage.setItem('onboardingComplete', 'false');
        setIsOnboardingComplete(false);
    };
    const completeOnboarding = () => {
        localStorage.setItem('onboardingComplete', 'true');
        setIsOnboardingComplete(true);
    };
    return (_jsx(PersonalInfoContext.Provider, { value: {
            personalInfo,
            setPersonalInfo,
            clearPersonalInfo,
            isOnboardingComplete,
            completeOnboarding
        }, children: children }));
}
export function usePersonalInfo() {
    const context = useContext(PersonalInfoContext);
    if (context === undefined) {
        throw new Error('usePersonalInfo must be used within a PersonalInfoProvider');
    }
    return context;
}
