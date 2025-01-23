import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateContextualSuggestions } from '../utils/suggestionsGenerator';
export default function SuggestionTabs({ lastMessage, zodiacSign, onSuggestionClick, isLoading }) {
    const [suggestions, setSuggestions] = useState([
        "今日の運勢を教えて",
        "恋愛運が知りたいです",
        "仕事でのアドバイスをください"
    ]);
    useEffect(() => {
        const updateSuggestions = async () => {
            if (!isLoading && lastMessage) {
                try {
                    const newSuggestions = await generateContextualSuggestions(lastMessage, zodiacSign);
                    setSuggestions(newSuggestions);
                }
                catch (error) {
                    console.error('Failed to generate suggestions:', error);
                }
            }
        };
        updateSuggestions();
    }, [lastMessage, zodiacSign, isLoading]);
    return (_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 }, className: "flex flex-wrap gap-2 justify-center mt-4", children: suggestions.map((suggestion, index) => (_jsx(motion.button, { onClick: () => onSuggestionClick(suggestion), className: "px-4 py-2 bg-purple-900/30 text-purple-200 rounded-full \n                     hover:bg-purple-800/40 transition-colors disabled:opacity-50", disabled: isLoading, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: suggestion }, suggestion + index))) }) }));
}
