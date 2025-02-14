import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Users, Gift } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-900">
      {/* ヘッダーセクション */}
      <header className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-purple-100 mb-6"
          >
            SENRI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-purple-200 mb-8"
          >
            占い師のための次世代プラットフォーム
          </motion.p>
        </div>
      </header>

      {/* テストユーザー募集セクション */}
      <section className="py-16 px-4 bg-purple-900/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-purple-800/30 border border-purple-700/50 rounded-lg p-8"
          >
            <div className="flex items-center justify-center mb-6">
              <Users className="w-12 h-12 text-purple-300" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-purple-100 text-center mb-4">
              テストユーザー募集中
            </h2>
            <p className="text-purple-200 text-center mb-8">
              SENRIの開発段階から参加して、あなたの意見を反映させませんか？
            </p>

            {/* 特典リスト */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-purple-900/30 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Star className="w-6 h-6 text-yellow-400 mr-2" />
                  <h3 className="text-lg font-semibold text-purple-100">
                    優待価格で利用可能
                  </h3>
                </div>
                <p className="text-purple-300">
                  正式リリース後、特別価格でサービスをご利用いただけます。
                </p>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Gift className="w-6 h-6 text-purple-400 mr-2" />
                  <h3 className="text-lg font-semibold text-purple-100">
                    機能リクエスト
                  </h3>
                </div>
                <p className="text-purple-300">
                  開発段階から機能のフィードバックや要望を出すことができます。
                </p>
              </div>
            </div>

            {/* 参加ボタン */}
            <div className="text-center">
              <button
                onClick={() => navigate('/survey')}
                className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors text-lg font-medium"
              >
                テストユーザーに応募する
              </button>
              <p className="mt-4 text-purple-400 text-sm">
                ※アンケートにお答えいただいた方に、24時間以内にログイン情報をお送りします
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* その他のセクション（特徴紹介など） */}
    </div>
  );
} 