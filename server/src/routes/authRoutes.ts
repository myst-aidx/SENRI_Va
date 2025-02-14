import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateLoginInput, validateRegisterInput } from '../utils/validation';
import { AppError, ErrorType } from '../types/errors';
import { createLogger } from '../utils/logger';

const logger = createLogger('authRoutes');
const router = Router();
const authController = AuthController.getInstance();

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const validationResult = validateRegisterInput({ email, password, name });
    
    if (!validationResult.isValid) {
      throw new AppError({
        statusCode: 400,
        message: validationResult.errors.join(', '),
        type: ErrorType.VALIDATION
      });
    }

    await authController.signup(req, res);
  } catch (error) {
    logger.error('Registration error:', error);
    next(new AppError({
      statusCode: 500,
      message: 'Registration failed',
      type: ErrorType.INTERNAL
    }));
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const validationResult = validateLoginInput({ email, password });
    
    if (!validationResult.isValid) {
      throw new AppError({
        statusCode: 400,
        message: validationResult.errors.join(', '),
        type: ErrorType.VALIDATION
      });
    }

    await authController.login(req, res);
  } catch (error) {
    logger.error('Login error:', error);
    next(new AppError({
      statusCode: 500,
      message: 'Login failed',
      type: ErrorType.INTERNAL
    }));
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    await authController.logout(req, res);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error:', error);
    next(new AppError({
      statusCode: 500,
      message: 'Logout failed',
      type: ErrorType.INTERNAL
    }));
  }
});

router.post('/refresh-token', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError({
        statusCode: 400,
        message: 'Refresh token is required',
        type: ErrorType.VALIDATION
      });
    }

    await authController.refreshToken(req, res);
  } catch (error) {
    logger.error('Token refresh error:', error);
    next(new AppError({
      statusCode: 500,
      message: 'Token refresh failed',
      type: ErrorType.INTERNAL
    }));
  }
});

export { router as authRouter };
