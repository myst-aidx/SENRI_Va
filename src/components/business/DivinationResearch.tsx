import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Home, BookOpen, Star } from 'lucide-react';

export default function DivinationResearch() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-900 text-purple-100">
      <nav className="p-4 bg-purple-900/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate('/business')}
            className="flex items-center space-x-2 text-purple-200 hover:text-purple-100"
          >
            <ChevronLeft size={24} />
            <span>戻る</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-purple-200 hover:text-purple-100"
          >
            <Home size={24} />
            <span>ホーム</span>
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400 text-transparent bg-clip-text"
          >
            COMING SOON
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl text-purple-300 text-center max-w-2xl mb-12"
          >
            占術研究機能は現在開発中です。
            <br />
            より良い機能を提供するため、しばらくお待ちください。
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 1,
              duration: 0.5,
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="bg-purple-800/20 rounded-lg p-6 text-center">
              <BookOpen size={32} className="mx-auto mb-4 text-purple-400" />
              <h3 className="text-lg font-semibold mb-2">占術理論の研究</h3>
              <p className="text-sm text-purple-300">
                古今東西の占術理論を体系的に学べる機能を提供予定
              </p>
            </div>

            <div className="bg-purple-800/20 rounded-lg p-6 text-center">
              <Star size={32} className="mx-auto mb-4 text-purple-400" />
              <h3 className="text-lg font-semibold mb-2">事例研究</h3>
              <p className="text-sm text-purple-300">
                実践的な事例を通じて占術の理解を深める機能を提供予定
              </p>
            </div>

            <div className="bg-purple-800/20 rounded-lg p-6 text-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <div className="w-8 h-8 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full" />
              </motion.div>
              <h3 className="text-lg font-semibold mb-2">コミュニティ</h3>
              <p className="text-sm text-purple-300">
                占い師同士の交流と知見の共有の場を提供予定
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 