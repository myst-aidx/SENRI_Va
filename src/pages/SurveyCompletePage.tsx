import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SurveyCompletePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-8 text-center"
        >
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-purple-100 mb-4">
            アンケートの送信が完了しました
          </h1>
          <p className="text-purple-200 mb-8">
            ご協力ありがとうございます。24時間以内に登録メールアドレス宛にログイン情報をお送りいたします。
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              トップページに戻る
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 