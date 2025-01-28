import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { LogOut, Briefcase, Sparkles, Settings, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // メニューの外側をクリックした時に閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ログインページとサインアップページではヘッダーのログインボタンを表示しない
  const hideAuthButtons = ['/login', '/signup'].includes(location.pathname);

  return (
    <header className="bg-purple-900/50 backdrop-blur-sm border-b border-purple-800/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-white hover:text-purple-200 transition-colors">
            SENRI
          </Link>
          
          <div className="flex items-center gap-4">
            <Link
              to="/fortune"
              className="flex items-center space-x-2 text-purple-200 hover:text-purple-100"
            >
              <Sparkles className="w-5 h-5" />
              <span>占術メニュー</span>
            </Link>

            <Link
              to="/business"
              className="flex items-center space-x-2 text-purple-200 hover:text-purple-100"
            >
              <Briefcase className="w-5 h-5" />
              <span>サポートツール</span>
            </Link>

            <div className="relative" ref={settingsRef}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowSettings(!showSettings);
                }}
                className="text-purple-200 hover:text-purple-100 p-2 rounded-lg hover:bg-purple-800/30 transition-colors flex items-center space-x-2"
              >
                <Settings size={24} />
                <span>設定</span>
              </button>
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-purple-900 rounded-lg shadow-xl z-50"
                  >
                    <div className="py-2">
                      <button
                        onClick={() => {
                          navigate('/settings/profile');
                          setShowSettings(false);
                        }}
                        className="w-full px-4 py-2 text-left text-purple-200 hover:bg-purple-800/50"
                      >
                        プロフィール設定
                      </button>
                      <button
                        onClick={() => {
                          navigate('/settings/account');
                          setShowSettings(false);
                        }}
                        className="w-full px-4 py-2 text-left text-purple-200 hover:bg-purple-800/50"
                      >
                        アカウント設定
                      </button>
                      <button
                        onClick={() => {
                          navigate('/settings/notifications');
                          setShowSettings(false);
                        }}
                        className="w-full px-4 py-2 text-left text-purple-200 hover:bg-purple-800/50"
                      >
                        通知設定
                      </button>
                      <button
                        onClick={() => {
                          navigate('/settings/integrations');
                          setShowSettings(false);
                        }}
                        className="w-full px-4 py-2 text-left text-purple-200 hover:bg-purple-800/50"
                      >
                        外部連携設定
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!hideAuthButtons && (
              <div className="flex items-center gap-2">
                <Link
                  to="/signup"
                  className="bg-transparent hover:bg-purple-800/30 text-white font-bold py-2 px-4 rounded-lg border border-purple-400 transition-colors"
                >
                  新規登録
                </Link>
                <Link
                  to="/login"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  ログイン
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 