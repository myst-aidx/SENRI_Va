import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { NumerologyParams } from '../types';
import { generateNumerologyReading } from '../utils/numerology';
import { saveNumerologyResult } from '../utils/numerologyStorage';
import LoadingSpinner from './LoadingSpinner';

// アニメーション設定
const animations = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

// 入力フォームコンポーネント
const InputForm = React.memo(({ onSubmit, isLoading }: {
  onSubmit: (params: NumerologyParams) => void;
  isLoading: boolean;
}) => {
  const [birthDate, setBirthDate] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ birthDate, name: name || undefined });
  }, [birthDate, name, onSubmit]);

  return (
    <motion.form
      role="form"
      aria-label="数秘術解析フォーム"
      onSubmit={handleSubmit}
      className="space-y-4 sm:space-y-6"
      {...animations}
    >
      <div role="group" aria-labelledby="birthdate-label">
        <label id="birthdate-label" className="block text-sm sm:text-base font-medium text-purple-200 mb-1 sm:mb-2">
          生年月日
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
          aria-required="true"
          className="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-purple-900/50 border border-purple-700/50 text-purple-100 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div role="group" aria-labelledby="name-label">
        <label id="name-label" className="block text-sm sm:text-base font-medium text-purple-200 mb-1 sm:mb-2">
          名前（オプション）
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="漢字、ひらがな、カタカナ、英字"
          className="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-purple-900/50 border border-purple-700/50 text-purple-100 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading}
        className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm sm:text-base hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
      >
        {isLoading ? '解析中...' : '解析する'}
      </button>
    </motion.form>
  );
});

// メインコンポーネント
export function NumerologyReader() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async (params: NumerologyParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await generateNumerologyReading(params);
      // 結果をローカルストレージに保存
      saveNumerologyResult(result);
      // 結果表示画面にリダイレクト
      navigate('/fortune/numerology/result');
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* ローディング画面 */}
      <AnimatePresence>
        {isLoading && (
          <LoadingSpinner message="数秘術で運命を読み解いています..." />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-100 text-center flex-grow">数秘術で運命を読み解く</h1>
        <button
          onClick={() => navigate('/fortune')}
          className="px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          占い選択に戻る
        </button>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            role="alert"
            className="bg-red-500/10 border border-red-500/50 text-red-400 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base"
            {...animations}
          >
            {error}
          </motion.div>
        )}

        <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
      </AnimatePresence>
    </div>
  );
} 