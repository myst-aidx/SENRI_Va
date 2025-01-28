const { AppError, ValidationError } = require('../types/errors');
const { createLogger } = require('../utils/logger');
const logger = createLogger('Validation');

const validateSignupInput = (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      throw new ValidationError('必須フィールドが不足しています。');
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('無効なメールアドレス形式です。');
    }

    // パスワードの強度チェック
    if (password.length < 8) {
      throw new ValidationError('パスワードは8文字以上である必要があります。');
    }

    // パスワードの複雑さチェック
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      throw new ValidationError('パスワードは少なくとも1つの大文字、小文字、数字を含む必要があります。');
    }

    // 名前の長さチェック
    if (name.length < 2 || name.length > 50) {
      throw new ValidationError('名前は2文字以上50文字以下である必要があります。');
    }

    next();
  } catch (error) {
    logger.error('Validation error:', error);
    res.status(400).json({
      message: error.message,
      type: 'ValidationError'
    });
  }
};

const validateRefreshToken = (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ValidationError('リフレッシュトークンが必要です。');
    }

    next();
  } catch (error) {
    logger.error('Refresh token validation error:', error);
    res.status(400).json({
      message: error.message,
      type: 'ValidationError'
    });
  }
};

module.exports = {
  validateSignupInput,
  validateRefreshToken
};
