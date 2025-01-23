import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
const ThemeContext = createContext({ theme: 'dark' });
export function ThemeProvider({ children }) {
    return (_jsx(ThemeContext.Provider, { value: { theme: 'dark' }, children: children }));
}
export function useTheme() {
    return useContext(ThemeContext);
}
