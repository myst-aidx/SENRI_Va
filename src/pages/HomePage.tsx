import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-900">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold text-purple-100 mb-4">神秘の占い</h1>
            <p className="text-xl text-purple-200">
              あなたの運命の導きを、最新のテクノロジーと伝統的な占術で解き明かします
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-purple-800/20 rounded-lg p-6"
            >
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl text-purple-300">⭐</span>
              </div>
              <h2 className="text-xl font-semibold text-purple-200 text-center mb-2">
                占星術の専門家による監修
              </h2>
              <p className="text-purple-300 text-center">
                経験豊富な占星術師たちが、精密な占いを提供します。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-purple-800/20 rounded-lg p-6"
            >
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl text-purple-300">👥</span>
              </div>
              <h2 className="text-xl font-semibold text-purple-200 text-center mb-2">
                95%以上の利用者満足度
              </h2>
              <p className="text-purple-300 text-center">
                多くのユーザーから高い評価をいただいています。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-purple-800/20 rounded-lg p-6"
            >
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl text-purple-300">🎯</span>
              </div>
              <h2 className="text-xl font-semibold text-purple-200 text-center mb-2">
                風水と四柱推命との統合分析
              </h2>
              <p className="text-purple-300 text-center">
                複数の占術を組み合わせた、より深い洞察を提供します。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-purple-800/20 rounded-lg p-6"
            >
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl text-purple-300">🔮</span>
              </div>
              <h2 className="text-xl font-semibold text-purple-200 text-center mb-2">
                独自のAIアルゴリズム
              </h2>
              <p className="text-purple-300 text-center">
                最新のテクノロジーを活用した、精度の高い占いを実現します。
              </p>
            </motion.div>
          </div>

          <div className="space-y-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-purple-100 mb-8">料金プラン</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* プレミアムプラン */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-purple-800/20 rounded-lg p-6 relative"
              >
                <div className="absolute top-4 right-4 bg-amber-500 text-white px-2 py-1 rounded-full text-xs">
                  おすすめ
                </div>
                <h3 className="text-xl font-bold text-purple-200 mb-4">プレミアムプラン</h3>
                <p className="text-3xl font-bold text-purple-100 mb-4">¥9,800<span className="text-sm font-normal">/月</span></p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-purple-200">
                    <span className="mr-2">✓</span>
                    四柱推命機能の無制限利用
                  </li>
                  <li className="flex items-center text-purple-200">
                    <span className="mr-2">✓</span>
                    動物占いの無制限利用
                  </li>
                  <li className="flex items-center text-purple-200">
                    <span className="mr-2">✓</span>
                    夢占いの無制限利用
                  </li>
                  <li className="flex items-center text-purple-200">
                    <span className="mr-2">✓</span>
                    手相占いの無制限利用
                  </li>
                  <li className="flex items-center text-purple-200">
                    <span className="mr-2">✓</span>
                    数秘術の無制限利用
                  </li>
                  <li className="flex items-center text-purple-200">
                    <span className="mr-2">✓</span>
                    詳細な運勢解説
                  </li>
                  <li className="flex items-center text-purple-200">
                    <span className="mr-2">✓</span>
                    24時間サポート
                  </li>
                  <li className="flex items-center text-purple-200">
                    <span className="mr-2">✓</span>
                    プレミアム限定コンテンツ
                  </li>
                  <li className="flex items-center text-purple-200">
                    <span className="mr-2">✓</span>
                    月1回の個別オンラインコンサルティング
                  </li>
                </ul>
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition-colors"
                >
                  プランを選択
                </button>
              </motion.div>

              {/* ベーシックプラン */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="bg-purple-800/20 rounded-lg p-6"
              >
                <h3 className="text-xl font-bold text-purple-200 mb-4">ベーシックプラン</h3>
                <p className="text-3xl font-bold text-purple-100 mb-4">¥4,980<span className="text-sm font-normal">/月</span></p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-purple-200">
                    <span className="mr-2">✓</span>
                    四柱推命機能の利用
                  </li>
                  <li className="flex items-center text-purple-200">
                    <span className="mr-2">✓</span>
                    動物占いの基本機能
                  </li>
                  <li className="flex items-center text-purple-200">
                    <span className="mr-2">✓</span>
                    夢占いの基本機能
                  </li>
                  <li className="flex items-center text-purple-200">
                    <span className="mr-2">✓</span>
                    手相占いの基本機能
                  </li>
                  <li className="flex items-center text-purple-200">
                    <span className="mr-2">✓</span>
                    数秘術の基本機能
                  </li>
                  <li className="flex items-center text-purple-200">
                    <span className="mr-2">✓</span>
                    基本的な運勢解説
                  </li>
                  <li className="flex items-center text-purple-200">
                    <span className="mr-2">✓</span>
                    メールサポート
                  </li>
                </ul>
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  プランを選択
                </button>
              </motion.div>

              {/* テストプラン */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="bg-purple-800/20 rounded-lg p-6"
              >
                <h3 className="text-xl font-bold text-purple-200 mb-4">テストプラン</h3>
                <p className="text-3xl font-bold text-purple-100 mb-4">¥0<span className="text-sm font-normal">/月</span></p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-purple-200">
                    <span className="mr-2">✓</span>
                    全ての占い機能が制限付で利用可能
                  </li>
                  <li className="flex items-center text-purple-200">
                    <span className="mr-2">✓</span>
                    全ての解説機能が利用可能
                  </li>
                  <li className="flex items-center text-purple-200">
                    <span className="mr-2">✓</span>
                    24時間サポート
                  </li>
                  <li className="flex items-center text-purple-200">
                    <span className="mr-2">✓</span>
                    テストユーザー専用機能
                  </li>
                  <li className="flex items-center text-purple-200">
                    <span className="mr-2">✓</span>
                    ※テストユーザー専用のプランです
                  </li>
                </ul>
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  プランを選択
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 