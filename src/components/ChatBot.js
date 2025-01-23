import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { getOpenAIResponse } from '../utils/openai';
import { astrologySigns } from '../utils/astrologyData';
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const generateActionAdvice = (responseText) => {
    const advices = [
        "今日は気になるお店に行ってみたり、新しい人に話しかけてみたりと、積極的に行動してみましょう。",
        " неожиданных поворотов судьбы. 油断は禁物です。",
        " близким человеком.   откройте свое сердце.",
        "ユーモアを忘れずに！深刻になりすぎないのがコツです。",
        "深呼吸して、落ち着いて考えましょう。焦りは禁物です。",
        "小さなことから始めてみましょう。千里の道も一歩からです。",
        "困った時は、誰かに相談してみましょう。案外簡単に解決するかもしれません。",
        "時には立ち止まって、周りを見渡してみるのも良いでしょう。",
        "今日できることは今日のうちにやってしまいましょう。",
        "自分を信じて、前向きに進んでいきましょう。"
    ];
    return getRandomElement(advices);
};
const generateHumorousRemark = () => {
    const remarks = [
        "占いの結果に удивляйтесь!  …良い意味で。",
        "あなたの未来は明るい…たぶん。  …曇りのち晴れ、みたいな？",
        " космических масштабах!  …あなたの悩みも宇宙から見れば、きっと小さなものですよ。",
        "今日のあなたは、まるで магнит для удачи!  …ただし、 металлических предметовを引き寄せるかもしれません。",
        " невзгод!  …でも、 дождьの後には必ず虹が出ますから。",
        "もし今日、空から पैसाが降ってきたら、私にも分けてくださいね！",
        "あなたの幸運レベルは сейчас オーバーフローしています！",
        "今日のあなたは、歩くパワースポットです！…たぶん、充電はできませんけど。",
        "未来は誰にもわかりません。…私も含めて。",
        "人生は сюрприз коробкаです。  …何が出てくるかはお楽しみ！"
    ];
    return getRandomElement(remarks);
};
export default function ChatBot() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "こんにちは！私はあなたの星占い案内人です。あなたの星座や気になることについて、なんでも聞いてください。",
            sender: 'bot',
            timestamp: new Date(),
            role: 'model',
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const handleSend = async () => {
        if (!input.trim() || isLoading)
            return;
        const userMessage = {
            id: Date.now(),
            text: input,
            sender: 'user',
            timestamp: new Date(),
            role: 'user',
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        try {
            const conversationHistory = messages.map(msg => ({
                role: msg.role,
                content: msg.text
            }));
            const response = await getOpenAIResponse(input, conversationHistory, new Date());
            let enhancedResponse = response;
            // 星座に関する情報を追加
            const signKeywords = astrologySigns.map(sign => sign.name);
            const foundSign = signKeywords.find(keyword => response.includes(keyword));
            if (foundSign) {
                const signInfo = astrologySigns.find(sign => sign.name === foundSign);
                enhancedResponse += `\nちなみに、${foundSign}のあなたは${signInfo?.traits.join('、')}な性格だと言われていますよ。`;
            }
            // 行動のアドバイスとユーモラスな発言を追加
            enhancedResponse += `\n${generateActionAdvice(response)} ${generateHumorousRemark()}`;
            const botResponse = {
                id: Date.now() + 1,
                text: enhancedResponse,
                sender: 'bot',
                timestamp: new Date(),
                role: 'model',
            };
            setMessages((prev) => [...prev, botResponse]);
        }
        catch (error) {
            const errorMessage = {
                id: Date.now() + 1,
                text: '申し訳ありません。エラーが発生しました。もう一度お試しください。',
                sender: 'bot',
                timestamp: new Date(),
                role: 'model',
            };
            setMessages((prev) => [...prev, errorMessage]);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "h-[600px] flex flex-col bg-purple-950/20 rounded-xl p-4", children: [_jsxs("div", { className: "flex-1 overflow-y-auto mb-4 space-y-4", children: [messages.map((message) => (_jsxs("div", { className: `flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`, children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user'
                                    ? 'bg-purple-500'
                                    : 'bg-indigo-600'}`, children: message.sender === 'user' ? (_jsx(User, { size: 16, className: "text-white" })) : (_jsx(Bot, { size: 16, className: "text-white" })) }), _jsx("div", { className: `max-w-[80%] rounded-2xl px-4 py-2 ${message.sender === 'user'
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-indigo-600/50 text-purple-50'}`, children: message.text })] }, message.id))), isLoading && (_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center", children: _jsx(Loader2, { size: 16, className: "text-white animate-spin" }) }), _jsx("div", { className: "bg-indigo-600/50 text-purple-50 max-w-[80%] rounded-2xl px-4 py-2", children: "\u5360\u3044\u306E\u795E\u8A17\u3092\u8AAD\u307F\u89E3\u3044\u3066\u3044\u307E\u3059..." })] })), _jsx("div", { ref: messagesEndRef })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleSend(), placeholder: "\u661F\u5EA7\u3084\u6C17\u306B\u306A\u308B\u3053\u3068\u3092\u805E\u3044\u3066\u304F\u3060\u3055\u3044...", className: "w-full bg-purple-900/30 text-purple-100 placeholder-purple-300/50 rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500", disabled: isLoading }), _jsx("button", { onClick: handleSend, disabled: isLoading, className: `absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full transition-colors
            ${isLoading
                            ? 'bg-purple-500/50 cursor-not-allowed'
                            : 'bg-purple-500 hover:bg-purple-600'}`, children: isLoading ? (_jsx(Loader2, { size: 16, className: "text-white animate-spin" })) : (_jsx(Send, { size: 16, className: "text-white" })) })] })] }));
}
