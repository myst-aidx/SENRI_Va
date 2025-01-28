import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot } from 'lucide-react';
import { getMBTIResult } from '../utils/mbtiStorage';
import { getMBTIAnalysis, generateNextQuestions } from '../utils/openai';
import ChatLoading from './ChatLoading';

type Message = {
  id: number;
  text: string;
  sender: 'bot' | 'user';
};

type Suggestion = {
  text: string;
  label: string;
  action: () => void;
};

type NextQuestion = {
  text: string;
  label: string;
};

export default function MBTIResultChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuestion, setLastQuestion] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const result = getMBTIResult();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (result && messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          text: `こんにちは！SENRIです。あなたの${result.type}タイプについて、もっと詳しく知りたいことはありますか？`,
          sender: 'bot'
        }
      ]);
      setSuggestions([
        {
          text: 'このタイプの強みについて詳しく教えてください',
          label: '強みについて',
          action: () => handleQuestion('このタイプの強みについて詳しく教えてください')
        },
        {
          text: 'このタイプの改善点や課題について詳しく教えてください',
          label: '改善点について',
          action: () => handleQuestion('このタイプの改善点や課題について詳しく教えてください')
        },
        {
          text: 'このタイプと相性の良いMBTIタイプについて、その理由も含めて教えてください',
          label: '相性について',
          action: () => handleQuestion('このタイプと相性の良いMBTIタイプについて、その理由も含めて教えてください')
        }
      ]);
    }
  }, [result]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, sender: 'bot' | 'user') => {
    setMessages(prev => [...prev, { id: Date.now(), text, sender }]);
  };

  const updateSuggestions = async (question: string, answer: string) => {
    if (!result) return;

    try {
      const nextQuestions = await generateNextQuestions(result.type, question, answer) as NextQuestion[];
      setSuggestions(
        nextQuestions.map(q => ({
          ...q,
          action: () => handleQuestion(q.text)
        }))
      );
    } catch (error) {
      console.error('Failed to generate next questions:', error);
    }
  };

  const handleQuestion = async (question: string) => {
    if (!result) return;
    
    setLastQuestion(question);
    addMessage(question, 'user');
    setIsLoading(true);

    try {
      const response = await getMBTIAnalysis(result.type, question);
      addMessage(response, 'bot');
      await updateSuggestions(question, response);
    } catch (error) {
      addMessage('申し訳ありません。回答の生成中にエラーが発生しました。', 'bot');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent | string) => {
    if (typeof e !== 'string') {
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement;
      const formData = new FormData(form);
      const question = formData.get('question') as string;
      if (!question || !result) return;
      setInputText('');
      await handleQuestion(question);
    } else {
      if (!result) return;
      await handleQuestion(e);
    }
  };

  const handleSuggestionClick = (question: string): void => {
    if (!question) return;
    handleSubmit(question);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
      <div className="flex flex-col w-full bg-gray-800 rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-gray-100">SENRIに質問する</h2>
        </div>
        <div className="h-[500px] overflow-y-auto mb-4 p-4 space-y-4 bg-gray-800">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <Bot className="inline-block w-4 h-4 mr-2 mb-1" />
                  )}
                  <span className="whitespace-pre-wrap">{message.text}</span>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start"
              >
                <ChatLoading />
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="space-y-4 p-4 bg-gray-800 border-t border-gray-700">
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={suggestion.action}
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-full text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                  title={suggestion.text}
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              name="question"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={isLoading ? "回答を生成中..." : "質問を入力してください..."}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 placeholder-gray-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              disabled={isLoading}
            >
              <Send className={`w-5 h-5 transition-transform duration-200 ${isLoading ? 'scale-90' : 'group-hover:scale-110'}`} />
              {isLoading && (
                <motion.div
                  className="absolute inset-0 bg-purple-500/20"
                  animate={{
                    x: ['0%', '100%']
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 