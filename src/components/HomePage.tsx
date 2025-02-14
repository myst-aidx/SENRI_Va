import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TestUserAuthModal from './TestUserAuthModal';
import { useAuth } from '../auth/AuthContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showTestUserModal, setShowTestUserModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'basic' | 'test' | null>(null);

  const handlePlanSelect = (planType: 'premium' | 'basic' | 'test') => {
    console.log('Plan selected:', planType);
    console.log('Is authenticated:', isAuthenticated);

    if (planType === 'test') {
      setShowTestUserModal(true);
      return;
    }

    setSelectedPlan(planType);
    if (isAuthenticated) {
      console.log('User is authenticated, navigating to subscription');
      navigate('/subscription', { 
        state: { selectedPlan: planType }
      });
    } else {
      console.log('User is not authenticated, navigating to login');
      navigate('/login', { 
        state: { 
          redirectTo: '/subscription',
          selectedPlan: planType 
        }
      });
    }
  };

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
            <h1 className="text-4xl md:text-5xl font-bold text-purple-100 mb-4">
              SENRI
            </h1>
            <p className="text-xl text-purple-200">
              最新のAI技術を活用した、精度の高い占いサービスをご提供します。
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

          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-purple-100 mb-8">料金プラン</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* プレミアムプラン */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-purple-800/20 rounded-lg p-6 relative flex flex-col h-full"
              >
                <div className="absolute top-4 right-4 bg-amber-500 text-white px-2 py-1 rounded-full text-xs">
                  おすすめ
                </div>
                <h3 className="text-xl font-bold text-purple-200 mb-4">プレミアムプラン</h3>
                <ul className="space-y-2 flex-grow">
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
                    夢占い
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
                  onClick={() => handlePlanSelect('premium')}
                  className="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition-colors mt-6"
                >
                  プランを選択
                </button>
              </motion.div>

              {/* ベーシックプラン */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="bg-purple-800/20 rounded-lg p-6 flex flex-col h-full"
              >
                <h3 className="text-xl font-bold text-purple-200 mb-4">ベーシックプラン</h3>
                <ul className="space-y-2 flex-grow">
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
                  onClick={() => handlePlanSelect('basic')}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors mt-6"
                >
                  プランを選択
                </button>
              </motion.div>

              {/* テストプラン */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="bg-purple-800/20 rounded-lg p-6 flex flex-col h-full"
              >
                <h3 className="text-xl font-bold text-purple-200 mb-4">テストプラン</h3>
                <ul className="space-y-2 flex-grow">
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
                    ※テストユーザー専用のプランです
                  </li>
                </ul>
                <button
                  onClick={() => handlePlanSelect('test')}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors mt-6"
                >
                  プランを選択
                </button>
              </motion.div>
            </div>
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <Link
              to="/fortune"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
            >
              占いを始める
            </Link>
            <Link
              to="/join"
              className="px-6 py-3 bg-purple-500/30 text-purple-200 border border-purple-500/50 rounded-lg hover:bg-purple-500/40 transition-colors"
            >
              テストユーザーに応募
            </Link>
          </div>
        </div>

        {/* テストユーザーモーダル */}
        {showTestUserModal && (
          <TestUserAuthModal
            onClose={() => setShowTestUserModal(false)}
            onSuccess={() => {
              setShowTestUserModal(false);
              navigate('/fortune');
            }}
          />
        )}
      </main>
    </div>
  );
}