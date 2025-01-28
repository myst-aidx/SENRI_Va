import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Calendar,
  Home,
  BookOpen,
  Target,
  Share2,
  PieChart,
  Crown
} from 'lucide-react';

// メニューブロックのスタイル定義
const blockStyle = "relative bg-purple-800/20 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:bg-purple-700/30";
const iconStyle = "w-8 h-8 text-purple-300";
const titleStyle = "text-xl font-medium text-purple-200 mb-2";
const descStyle = "text-sm text-purple-300/90";
const premiumBadgeStyle = "absolute top-4 right-4 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium";

// アニメーション設定
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function FortuneBusinessPage() {
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-900">
      <nav className="p-4 bg-purple-900/50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
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
        <h1 className="text-3xl font-bold text-center text-purple-100 mb-12">占い師サポート</h1>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* マーケティング分析 */}
          <motion.div
            variants={itemVariants}
            className={blockStyle}
            onClick={() => handleClick('/business/analytics')}
          >
            <div className="flex items-start space-x-4">
              <TrendingUp className={iconStyle} />
              <div>
                <h2 className={titleStyle}>マーケティング分析</h2>
                <p className={descStyle}>
                  顧客データの分析と集客戦略の立案をサポートします。
                </p>
              </div>
            </div>
            <div className={premiumBadgeStyle}>
              <Crown size={14} />
              <span>PRO</span>
            </div>
          </motion.div>

          {/* 顧客・相談管理 */}
          <motion.div
            variants={itemVariants}
            className={blockStyle}
            onClick={() => handleClick('/business/customers')}
          >
            <div className="flex items-start space-x-4">
              <Users className={iconStyle} />
              <div>
                <h2 className={titleStyle}>顧客・相談管理</h2>
                <p className={descStyle}>
                  顧客情報と相談履歴の一元管理で、より良い占いサービスを提供します。
                </p>
              </div>
            </div>
            <div className={premiumBadgeStyle}>
              <Crown size={14} />
              <span>PRO</span>
            </div>
          </motion.div>

          {/* 予約管理 */}
          <motion.div
            variants={itemVariants}
            className={blockStyle}
            onClick={() => handleClick('/business/appointments')}
          >
            <div className="flex items-start space-x-4">
              <Calendar className={iconStyle} />
              <div>
                <h2 className={titleStyle}>予約管理</h2>
                <p className={descStyle}>
                  スケジュール管理と予約システムを提供します。
                </p>
              </div>
            </div>
            <div className={premiumBadgeStyle}>
              <Crown size={14} />
              <span>PRO</span>
            </div>
          </motion.div>

          {/* 占術研究 */}
          <motion.div
            variants={itemVariants}
            className={blockStyle}
            onClick={() => handleClick('/business/research')}
          >
            <div className="flex items-start space-x-4">
              <BookOpen className={iconStyle} />
              <div>
                <h2 className={titleStyle}>占術研究</h2>
                <p className={descStyle}>
                  最新の占術理論と研究資料を提供します。
                </p>
              </div>
            </div>
            <div className={premiumBadgeStyle}>
              <Crown size={14} />
              <span>PRO</span>
            </div>
          </motion.div>

          {/* ビジネス目標管理 */}
          <motion.div
            variants={itemVariants}
            className={blockStyle}
            onClick={() => handleClick('/business/goals')}
          >
            <div className="flex items-start space-x-4">
              <Target className={iconStyle} />
              <div>
                <h2 className={titleStyle}>ビジネス目標管理</h2>
                <p className={descStyle}>
                  事業目標の設定と進捗管理をサポートします。
                </p>
              </div>
            </div>
            <div className={premiumBadgeStyle}>
              <Crown size={14} />
              <span>PRO</span>
            </div>
          </motion.div>

          {/* SNSマーケティング */}
          <motion.div
            variants={itemVariants}
            className={blockStyle}
            onClick={() => handleClick('/business/social')}
          >
            <div className="flex items-start space-x-4">
              <Share2 className={iconStyle} />
              <div>
                <h2 className={titleStyle}>SNSマーケティング</h2>
                <p className={descStyle}>
                  SNSを活用した集客と情報発信を支援します。
                </p>
              </div>
            </div>
            <div className={premiumBadgeStyle}>
              <Crown size={14} />
              <span>PRO</span>
            </div>
          </motion.div>

          {/* 売上分析 */}
          <motion.div
            variants={itemVariants}
            className={blockStyle}
            onClick={() => handleClick('/business/sales')}
          >
            <div className="flex items-start space-x-4">
              <PieChart className={iconStyle} />
              <div>
                <h2 className={titleStyle}>売上分析</h2>
                <p className={descStyle}>
                  売上データの分析と収益改善をサポートします。
                </p>
              </div>
            </div>
            <div className={premiumBadgeStyle}>
              <Crown size={14} />
              <span>PRO</span>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
} 