import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { loginRequest } from '../auth/AuthService';

interface LocationState {
  redirectTo?: string;
  selectedPlan?: 'premium' | 'basic' | 'test';
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const locationState = location.state as LocationState;

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = locationState?.redirectTo || '/fortune';
      const selectedPlan = locationState?.selectedPlan;
      
      if (redirectTo === '/subscription' && selectedPlan) {
        navigate('/subscription', { 
          state: { selectedPlan }
        });
      } else {
        navigate(redirectTo);
      }
    }
  }, [isAuthenticated, navigate, locationState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await loginRequest(email, password);
      await login(response.token);
    } catch (err) {
      console.error('Login error:', err);
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
    }
  };

  const handleForceLogin = async () => {
    try {
      await login('debug_mode_token');
    } catch (err) {
      console.error('Force Login - Error:', err);
      setError('強制ログインに失敗しました。');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <h2 className="text-center text-3xl font-extrabold text-white">ログイン</h2>
        {error && (
          <div className="bg-red-500 text-white p-3 rounded">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
            placeholder="メールアドレス"
            autoComplete="email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
            placeholder="パスワード"
            autoComplete="current-password"
          />
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            ログイン
          </button>
        </form>

        <button
          onClick={handleForceLogin}
          className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          強制ログイン（デバッグ用）
        </button>
      </div>
    </div>
  );
}
