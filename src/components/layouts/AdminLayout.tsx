import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut,
  ChevronDown,
  Menu
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const menuItems = [
    {
      label: 'ダッシュボード',
      path: '/admin',
      icon: LayoutDashboard
    },
    {
      label: 'テストユーザー管理',
      path: '/admin/users',
      icon: Users
    },
    {
      label: '設定',
      path: '/admin/settings',
      icon: Settings
    }
  ];

  const handleLogout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      await fetch(`${apiUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-900">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-purple-900/50 backdrop-blur-sm border-b border-purple-800/30">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-purple-200 hover:text-purple-100 rounded-lg hover:bg-purple-800/20"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="ml-4 text-xl font-bold text-purple-100">
              SENRI 管理画面
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-1.5 text-purple-200 hover:text-purple-100 rounded-lg hover:bg-purple-800/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            ログアウト
          </button>
        </div>
      </header>

      {/* サイドバー */}
      <div
        className={`fixed left-0 top-[49px] bottom-0 z-40 w-64 bg-purple-900/50 backdrop-blur-sm border-r border-purple-800/30 transform transition-transform duration-200 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-purple-700/50 text-purple-100'
                        : 'text-purple-200 hover:bg-purple-800/30 hover:text-purple-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* メインコンテンツ */}
      <main
        className={`pt-[49px] transition-all duration-200 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
} 