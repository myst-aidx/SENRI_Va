import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { loginRequest } from '../auth/AuthService';
import { Box, Button, TextField, Typography, Container } from '@mui/material';

interface LocationState {
  redirectTo?: string;
  selectedPlan?: 'premium' | 'basic' | 'test';
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;

  useEffect(() => {
    console.log('LoginPage useEffect - Location state:', locationState);
    console.log('Is authenticated:', isAuthenticated);

    if (isAuthenticated) {
      const redirectPath = locationState?.redirectTo || '/fortune';
      console.log('Redirecting to:', redirectPath);
      
      if (redirectPath === '/subscription' && locationState?.selectedPlan) {
        navigate(redirectPath, {
          state: { selectedPlan: locationState.selectedPlan }
        });
      } else {
        navigate(redirectPath);
      }
    }
  }, [isAuthenticated, navigate, locationState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting login with email:', email);
    
    try {
      const { token } = await loginRequest(email, password);
      console.log('Login response token:', token);
      await login(token);
    } catch (error) {
      console.error('Login error:', error);
      // エラー処理を追加
    }
  };

  const handleForceLogin = async () => {
    console.log('Force login initiated');
    try {
      await login('debug_mode_token');
      console.log('Force login successful');
    } catch (error) {
      console.error('Force login error:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          ログイン
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="メールアドレス"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="パスワード"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            ログイン
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleForceLogin}
            sx={{ mt: 1 }}
          >
            テストユーザーとしてログイン
          </Button>
        </Box>
      </Box>
    </Container>
  );
} 
