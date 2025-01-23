import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import LoadingSpinner from './LoadingSpinner';
export function LoadingOverlay({ isLoading, message = 'Loading...', blur = true }) {
    if (!isLoading)
        return null;
    return (_jsx("div", { className: `fixed inset-0 z-50 flex items-center justify-center ${blur ? 'backdrop-blur-sm' : ''} bg-black/30`, children: _jsxs("div", { className: "bg-white/90 rounded-lg shadow-xl p-8 flex flex-col items-center space-y-4", children: [_jsx(LoadingSpinner, { size: "large", color: "#6366f1" }), message && (_jsx("p", { className: "text-gray-700 text-lg font-medium", children: message }))] }) }));
}
