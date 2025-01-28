import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import SixStarsReader from './components/SixStarsReader';
import TarotReader from './components/TarotReader';
import TarotResult from './components/TarotResult';
import PalmReader from './components/PalmReader';
import PalmResult from './components/PalmResult';
import HomePage from './components/HomePage';
import PersonalInfoOnboarding from './components/PersonalInfoOnboarding';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import FortunePage from './pages/FortunePage';
import { NumerologyReader } from './components/NumerologyReader';
import NumerologyResult from './components/NumerologyResult';
import DreamReader from './components/DreamReader';
import DreamResult from './components/DreamResult';
import AnimalReader from './components/AnimalReader';
import AnimalResult from './components/AnimalResult';
import FourPillarsReader from './components/FourPillarsReader';
import FourPillarsResult from './components/FourPillarsResult';
import FengshuiReader from './components/FengshuiReader';
import FengshuiResult from './components/FengshuiResult';
import MBTIReader from './components/MBTIReader';
import MBTIResult from './components/MBTIResult';
import { PasswordReset } from './components/PasswordReset';
import { ThemeProvider } from './contexts/ThemeContext';
import { PersonalInfoProvider } from './contexts/PersonalInfoContext';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HistoryPage from './pages/HistoryPage';
import SanmeiReader from './components/SanmeiReader';
import FortuneBusinessPage from './pages/FortuneBusinessPage';
import MarketingAnalytics from './components/business/MarketingAnalytics';
import CustomerManagement from './components/business/CustomerManagement';
import ConsultationManagement from './components/business/ConsultationManagement';
import AppointmentManagement from './components/business/AppointmentManagement';
import DivinationResearch from './components/business/DivinationResearch';
import BusinessGoals from './components/business/BusinessGoals';
import SocialMarketing from './components/business/SocialMarketing';
import SalesAnalytics from './components/business/SalesAnalytics';
import CustomerProfile from './components/business/CustomerProfile';
import { ProfileSettings } from './components/settings/ProfileSettings';
import { AccountSettings } from './components/settings/AccountSettings';
import { NotificationSettings } from './components/settings/NotificationSettings';
import { IntegrationSettings } from './components/settings/IntegrationSettings';
import KyuseiReader from './components/KyuseiReader';
import KyuseiResult from './components/KyuseiResult';
import SeimeiReader from './components/SeimeiReader';
import SeimeiResult from './components/SeimeiResult';
import SubscriptionPage from './pages/SubscriptionPage';
import ComingSoonPage from './pages/ComingSoonPage';
import { Settings, ChevronDown, Star, Menu, LogOut } from 'react-feather';

function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </LoadingProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const isHomePage = location.pathname === '/';
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  // 占術メニューの4つの占いのパスを定義
  const basicFortunePages = [
    '/fortune/mbti',
    '/fortune/sixstars',
    '/fortune/numerology',
    '/fortune/palm'
  ];

  // フッターを表示しないページを判定
  const shouldHideFooter = isHomePage || basicFortunePages.includes(location.pathname);

  const handleNavigate = (path: string) => {
    navigate(path);
    setShowSettingsMenu(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="App">
      {!isHomePage && (
        <header className="sticky top-0 z-50">
          <nav className="flex justify-end items-center px-4 py-2 bg-purple-900/50 backdrop-blur-sm border-b border-purple-800/30">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleNavigate('/fortune')}
                className="flex items-center space-x-1 text-purple-200 hover:text-purple-100 transition-colors px-3 py-1.5 rounded-lg hover:bg-purple-800/20 text-sm"
              >
                占いメニュー
              </button>
              <button 
                onClick={() => handleNavigate('/business')}
                className="flex items-center space-x-1 text-purple-200 hover:text-purple-100 transition-colors px-3 py-1.5 rounded-lg hover:bg-purple-800/20 text-sm"
              >
                <div className="relative flex items-center">
                  サポートツール
                  <span className="ml-1 inline-flex items-center justify-center bg-amber-400 text-purple-900 text-[10px] px-1 rounded">PRO</span>
                </div>
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                  className="flex items-center space-x-1 text-purple-200 hover:text-purple-100 transition-colors px-2 py-1.5 rounded-lg hover:bg-purple-800/20 text-sm"
                >
                  <Settings size={16} />
                  <span>設定</span>
                  <ChevronDown 
                    size={14} 
                    className={`transform transition-transform duration-200 ${showSettingsMenu ? 'rotate-180' : ''}`} 
                  />
                </button>
                {showSettingsMenu && (
                  <div className="absolute right-0 mt-1 w-48 bg-purple-900/95 backdrop-blur-sm rounded-lg shadow-lg py-1 border border-purple-800/30">
                    <button
                      onClick={() => handleNavigate('/settings/profile')}
                      className="w-full text-left px-4 py-2 text-purple-200 hover:bg-purple-800/50 transition-colors text-sm"
                    >
                      プロフィール設定
                    </button>
                    <button
                      onClick={() => handleNavigate('/settings/account')}
                      className="w-full text-left px-4 py-2 text-purple-200 hover:bg-purple-800/50 transition-colors text-sm"
                    >
                      アカウント設定
                    </button>
                    <button
                      onClick={() => handleNavigate('/settings/notifications')}
                      className="w-full text-left px-4 py-2 text-purple-200 hover:bg-purple-800/50 transition-colors text-sm"
                    >
                      通知設定
                    </button>
                    <button
                      onClick={() => handleNavigate('/settings/integrations')}
                      className="w-full text-left px-4 py-2 text-purple-200 hover:bg-purple-800/50 transition-colors text-sm"
                    >
                      連携設定
                    </button>
                  </div>
                )}
              </div>
              {!isAuthenticated ? (
                <>
                  <button 
                    onClick={() => handleNavigate('/signup')}
                    className="text-sm bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    新規登録
                  </button>
                  <button 
                    onClick={() => handleNavigate('/login')}
                    className="text-sm bg-purple-500 text-white px-3 py-1.5 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    ログイン
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm text-purple-200 hover:text-purple-100 transition-colors px-3 py-1.5 rounded-lg hover:bg-purple-800/20"
                >
                  <LogOut size={16} />
                  <span>ログアウト</span>
                </button>
              )}
            </div>
          </nav>
        </header>
      )}

      <Routes>
        {/* パブリックルート */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/coming-soon" element={<ComingSoonPage />} />
        
        {/* 占いルート */}
        <Route path="/fortune" element={<FortunePage />} />
        <Route path="/fortune/mbti" element={<MBTIReader />} />
        <Route path="/fortune/mbti/result" element={<MBTIResult />} />
        <Route path="/fortune/sixstars" element={<SixStarsReader />} />
        <Route path="/fortune/tarot" element={<TarotReader />} />
        <Route path="/fortune/tarot/result" element={<TarotResult />} />
        <Route path="/fortune/palm" element={<PalmReader />} />
        <Route path="/fortune/palm/result" element={<PalmResult />} />
        <Route path="/fortune/numerology" element={<NumerologyReader />} />
        <Route path="/fortune/numerology/result" element={<NumerologyResult />} />
        <Route path="/fortune/dream" element={<DreamReader />} />
        <Route path="/fortune/dream/result" element={<DreamResult />} />
        <Route path="/fortune/animal" element={<AnimalReader />} />
        <Route path="/fortune/animal/result" element={<AnimalResult />} />
        <Route path="/fortune/fourpillars" element={<FourPillarsReader />} />
        <Route path="/fortune/fourpillars/result" element={<FourPillarsResult />} />
        <Route path="/fortune/fengshui" element={<FengshuiReader />} />
        <Route path="/fortune/fengshui/result" element={<FengshuiResult />} />
        <Route path="/fortune/sanmei" element={<SanmeiReader />} />
        <Route path="/fortune/kyusei" element={<KyuseiReader />} />
        <Route path="/fortune/kyusei/result" element={<KyuseiResult />} />
        <Route path="/fortune/onboarding" element={<PersonalInfoOnboarding onComplete={() => {}} onSkip={() => {}} />} />
        <Route path="/fortune/history" element={<HistoryPage />} />
        <Route path="/fortune/seimei" element={<SeimeiReader />} />
        <Route path="/fortune/seimei/result" element={<SeimeiResult />} />

        {/* ビジネスルート */}
        <Route path="/business/*" element={<FortuneBusinessPage />} />
        <Route path="/business/analytics" element={<MarketingAnalytics />} />
        <Route path="/business/customers" element={<CustomerManagement />} />
        <Route path="/business/customer/:id" element={<CustomerProfile />} />
        <Route path="/business/consultations" element={<ConsultationManagement />} />
        <Route path="/business/appointments" element={<AppointmentManagement />} />
        <Route path="/business/research" element={<DivinationResearch />} />
        <Route path="/business/goals" element={<BusinessGoals />} />
        <Route path="/business/social" element={<SocialMarketing />} />
        <Route path="/business/sales" element={<SalesAnalytics />} />

        {/* 設定ルート */}
        <Route path="/settings/profile" element={<ProfileSettings />} />
        <Route path="/settings/account" element={<AccountSettings />} />
        <Route path="/settings/notifications" element={<NotificationSettings />} />
        <Route path="/settings/integrations" element={<IntegrationSettings />} />

        {/* 404ページ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!shouldHideFooter && (
        <footer className="mt-auto">
          <nav className="flex justify-center space-x-4 p-4 bg-purple-900/50 backdrop-blur-sm">
            <button 
              onClick={() => handleNavigate('/fortune')}
              className="text-purple-200 hover:text-purple-100 transition-colors"
            >
              占いメニュー
            </button>
            <button 
              onClick={() => handleNavigate('/business')}
              className="text-purple-200 hover:text-purple-100 transition-colors"
            >
              サポートツール
            </button>
          </nav>
        </footer>
      )}

      <ToastContainer />
    </div>
  );
}

export default App;