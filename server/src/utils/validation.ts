import { AppError, ErrorType } from '../types/errors';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput extends LoginInput {
  name: string;
}

/**
 * メールアドレスのバリデーション
 */
export const validateEmail = (email: string): boolean => {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return EMAIL_REGEX.test(email);
};

/**
 * パスワードのバリデーション
 * - 8文字以上
 * - 英字と数字を含む
 */
export const validatePassword = (password: string): boolean => {
  const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return PASSWORD_REGEX.test(password);
};

/**
 * ログイン入力のバリデーション
 */
export const validateLoginInput = (input: LoginInput): ValidationResult => {
  const errors: string[] = [];

  if (!input.email) {
    errors.push('メールアドレスは必須です');
  } else if (!validateEmail(input.email)) {
    errors.push('メールアドレスの形式が正しくありません');
  }

  if (!input.password) {
    errors.push('パスワードは必須です');
  } else if (!validatePassword(input.password)) {
    errors.push('パスワードは8文字以上で、英字と数字を含む必要があります');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * ユーザー登録入力のバリデーション
 */
export const validateRegisterInput = (input: RegisterInput): ValidationResult => {
  const errors: string[] = [];

  if (!input.name) {
    errors.push('名前は必須です');
  } else if (input.name.length < 2) {
    errors.push('名前は2文字以上である必要があります');
  }

  const loginValidation = validateLoginInput(input);
  errors.push(...loginValidation.errors);

  return {
    isValid: errors.length === 0,
    errors
  };
}; 