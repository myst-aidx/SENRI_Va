import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { generateAnimalReading, ANIMALS, COLORS } from '../utils/animal';
import LoadingSpinner from './LoadingSpinner';

export default function AnimalReader() {
  const navigate = useNavigate();
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const year = parseInt(birthYear);
    const month = parseInt(birthMonth);
    const day = parseInt(birthDay);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      setError('正しい生年月日を入力してください');
      return;
    }

    try {
      setError('');
      setIsLoading(true);

      const result = await generateAnimalReading(year, month, day);
      localStorage.setItem('animalResult', JSON.stringify(result));
      navigate('/fortune/animal/result');

    } catch (err) {
      setError('占いの解析中にエラーが発生しました。もう一度お試しください。');
      console.error('Animal reading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-100 text-center flex-grow">
          動物占い
        </h1>
        <button
          onClick={() => navigate('/fortune')}
          className="px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          占い選択に戻る
        </button>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
        <h2 className="text-xl text-purple-200 mb-4">動物占いとは</h2>
        <p className="text-gray-300 mb-4">
          動物占いは、生年月日から導き出される「動物」と「カラー」の組み合わせによって、あなたの性格や行動パターン、運勢を読み解く占いです。
          東洋の四柱推命と心理学的要素を組み合わせた、科学的な側面も持つ性格診断として人気があります。
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-center">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-800/50 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-purple-200 mb-2">生まれた年</label>
            <input
              type="number"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              placeholder="1990"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-purple-200 mb-2">月</label>
            <input
              type="number"
              value={birthMonth}
              onChange={(e) => setBirthMonth(e.target.value)}
              placeholder="1-12"
              min="1"
              max="12"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-purple-200 mb-2">日</label>
            <input
              type="number"
              value={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
              placeholder="1-31"
              min="1"
              max="31"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '鑑定中...' : '動物を鑑定する'}
        </button>
      </form>

      {/* 動物一覧 */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h2 className="text-xl text-purple-200 mb-4">12種類の動物たち</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.values(ANIMALS).map((animal) => (
            <motion.div
              key={animal.name}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-700/50 p-4 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-purple-300 mb-2">{animal.name}</h3>
              <p className="text-sm text-gray-300">{animal.traits}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* カラー一覧 */}
      <div className="bg-gray-800/50 rounded-lg p-6 mt-8">
        <h2 className="text-xl text-purple-200 mb-4">6つのカラー</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.values(COLORS).map((color) => (
            <motion.div
              key={color.name}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-700/50 p-4 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-purple-300 mb-2">
                {color.name}（{color.element}）
              </h3>
              <p className="text-sm text-gray-300">{color.traits}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <LoadingSpinner message="あなたの動物を鑑定しています..." />
        </div>
      )}
    </div>
  );
} 