import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';
import {
  Sparkles,
  Calculator,
  Calendar,
  Home,
  Compass,
  Hand,
  Moon,
  Cat,
  Brain,
  MoonStar,
  User,
  Star,
  FileText,
  Crown
} from 'lucide-react';
import { Link } from 'react-router-dom';

// メニューブロックのスタイル定義
const blockStyle = "relative bg-purple-800/20 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:bg-purple-700/30";
const iconStyle = "w-8 h-8 text-purple-300";
const titleStyle = "text-xl font-medium text-purple-200 mb-2";
const descStyle = "text-sm text-purple-300/90";
const premiumBadgeStyle = "absolute top-4 right-4 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium";
const tabStyle = "px-6 py-3 text-lg font-medium text-purple-200 border-b-2 cursor-pointer transition-colors";
const activeTabStyle = "border-purple-500 text-purple-100";
const inactiveTabStyle = "border-transparent hover:border-purple-700 hover:text-purple-100";

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

export default function FortunePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'basic' | 'premium'>('basic');

  const handleClick = (path: string) => {
    navigate(path);
  };

  const basicMenuItems = [
    {
      path: '/fortune/mbti',
      icon: Brain,
      title: 'MBTI性格診断',
      description: '16の性格タイプから、あなたの真の性格と可能性を探ります。'
    },
    {
      path: '/fortune/sixstars',
      icon: Sparkles,
      title: '六星占術',
      description: '東洋の陰陽五行思想に基づき、あなたの本命星と運命の流れを読み解きます。'
    },
    {
      path: '/fortune/numerology',
      icon: Calculator,
      title: '数秘術',
      description: '生年月日から導き出される数字で、あなたの運命のパターンを解き明かします。'
    },
    {
      path: '/fortune/palm',
      icon: Hand,
      title: '手相占い',
      description: 'あなたの手のひらに刻まれた運命の筋を読み解きます。'
    }
  ];

  const premiumMenuItems = [
    {
      path: '/fortune/tarot',
      icon: Sparkles,
      title: 'タロット占い',
      description: '神秘的なタロットカードがあなたの運命を導きます。'
    },
    {
      path: '/fortune/animal',
      icon: Cat,
      title: '動物占い',
      description: 'あなたの心に宿る守護動物を見つけ、その意味を解き明かします。'
    },
    {
      path: '/fortune/dream',
      icon: Moon,
      title: '夢占い',
      description: 'あなたの見た夢の意味を解読し、メッセージを読み解きます。'
    },
    {
      path: '/fortune/seimei',
      icon: FileText,
      title: '姓名判断',
      description: '漢字の持つ画数とエネルギーから、あなたの名前に秘められた運命を読み解きます。'
    },
    {
      path: '/fortune/fourpillars',
      icon: Calendar,
      title: '四柱推命',
      description: '生年月日時から導き出される四つの柱で、あなたの運命を占います。'
    },
    {
      path: '/fortune/fengshui',
      icon: Compass,
      title: '風水占い',
      description: '住空間の気の流れから、運気の改善と人生の調和を導きます。'
    },
    {
      path: '/fortune/sanmei',
      icon: MoonStar,
      title: '算命学',
      description: '生年月日時から導き出される運命の要素を詳しく解説します。'
    },
    {
      path: '/fortune/kyusei',
      icon: Star,
      title: '九星気学',
      description: '九つの星の気を読み解き、運勢の流れと相性を占います。'
    },
    {
      path: '/coming-soon',
      icon: Brain,
      title: 'パーソナルSENRI',
      description: 'AIが搭載された占い師と対話形式で詳しい運勢を解説します。あなたの質問に合わせて、より深い洞察を提供します。',
      fullWidth: true
    }
  ];

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
        <h1 className="text-3xl font-bold text-center text-purple-100 mb-8">占いメニュー</h1>

        <div className="flex justify-center mb-8">
          <div className="flex space-x-4 border-b border-purple-800">
            <button
              className={`${tabStyle} ${activeTab === 'basic' ? activeTabStyle : inactiveTabStyle}`}
              onClick={() => setActiveTab('basic')}
            >
              占術メニュー
            </button>
            <button
              className={`${tabStyle} ${activeTab === 'premium' ? activeTabStyle : inactiveTabStyle}`}
              onClick={() => setActiveTab('premium')}
            >
              プレミアムメニュー
            </button>
          </div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {activeTab === 'basic' ? (
            basicMenuItems.map((item) => (
              <motion.div
                key={item.path}
                variants={itemVariants}
                className={blockStyle}
                onClick={() => handleClick(item.path)}
              >
                <div className="flex items-start space-x-4">
                  <item.icon className={iconStyle} />
                  <div>
                    <h2 className={titleStyle}>{item.title}</h2>
                    <p className={descStyle}>{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            premiumMenuItems.map((item) => (
              <motion.div
                key={item.path}
                variants={itemVariants}
                className={`${blockStyle} ${item.fullWidth ? 'col-span-full' : ''}`}
                onClick={() => handleClick(item.path)}
              >
                <div className="flex items-start space-x-4">
                  <item.icon className={iconStyle} />
                  <div>
                    <h2 className={titleStyle}>{item.title}</h2>
                    <p className={descStyle}>{item.description}</p>
                  </div>
                </div>
                <div className={premiumBadgeStyle}>
                  <Crown size={14} />
                  <span>PRO</span>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </main>
    </div>
  );
} 