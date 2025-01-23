import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AstrologyChatBot from './components/AstrologyChatBot';
import TarotReader from './components/TarotReader';
import PalmReader from './components/PalmReader';
import HomePage from './components/HomePage';
import PersonalInfoOnboarding from './components/PersonalInfoOnboarding';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import FortunePage from './pages/FortunePage';
import { NumerologyReader } from './components/NumerologyReader';
import DreamReader from './components/DreamReader';
import AnimalReader from './components/AnimalReader';
import FourPillarsReader from './components/FourPillarsReader';
import FengshuiReader from './components/FengshuiReader';
import { PasswordReset } from './components/PasswordReset';
import { ThemeProvider } from './contexts/ThemeContext';
import { PersonalInfoProvider } from './contexts/PersonalInfoContext';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HistoryPage from './pages/HistoryPage';
function App() {
    return (_jsx(PersonalInfoProvider, { children: _jsx(BrowserRouter, { children: _jsx(ThemeProvider, { children: _jsx(AuthProvider, { children: _jsx(LoadingProvider, { children: _jsxs("div", { className: "min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900", children: [_jsx(Header, {}), _jsx("div", { className: "container mx-auto px-4 py-8", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/signup", element: _jsx(SignupPage, {}) }), _jsx(Route, { path: "/reset-password", element: _jsx(PasswordReset, {}) }), _jsxs(Route, { path: "/fortune", children: [_jsx(Route, { index: true, element: _jsx(FortunePage, {}) }), _jsx(Route, { path: "astrology", element: _jsx(AstrologyChatBot, {}) }), _jsx(Route, { path: "tarot", element: _jsx(TarotReader, {}) }), _jsx(Route, { path: "palm", element: _jsx(PalmReader, {}) }), _jsx(Route, { path: "numerology", element: _jsx(NumerologyReader, {}) }), _jsx(Route, { path: "dream", element: _jsx(DreamReader, {}) }), _jsx(Route, { path: "animal", element: _jsx(AnimalReader, {}) }), _jsx(Route, { path: "fourpillars", element: _jsx(FourPillarsReader, {}) }), _jsx(Route, { path: "fengshui", element: _jsx(FengshuiReader, {}) }), _jsx(Route, { path: "onboarding", element: _jsx(PersonalInfoOnboarding, { onComplete: () => { }, onSkip: () => { } }) }), _jsx(Route, { path: "history", element: _jsx(HistoryPage, {}) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }), _jsx(ToastContainer, {})] }) }) }) }) }) }));
}
export default App;
