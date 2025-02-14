import { ErrorType } from '../types/errors';

export const ErrorMessages = {
  VALIDATION_ERROR: 'バリデーションエラーが発生しました',
  UNAUTHORIZED: '認証が必要です',
  FORBIDDEN: 'アクセスが拒否されました',
  NOT_FOUND: 'リソースが見つかりません',
  DATABASE_ERROR: 'データベースエラーが発生しました',
  INTERNAL_ERROR: '内部サーバーエラーが発生しました',
  TOKEN_EXPIRED: 'トークンの有効期限が切れています',
  TOKEN_INVALID: '無効なトークンです',
  DUPLICATE_EMAIL: 'このメールアドレスは既に使用されています',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN_ERROR: '不明なエラーが発生しました',
  SERVER_ERROR: 'サーバーエラーが発生しました'
} as const;

export type ErrorMessagesType = typeof ErrorMessages;
export type ErrorMessageType = ErrorMessagesType[keyof ErrorMessagesType];

export const errorTypeToMessage: Record<ErrorType, string> = {
  [ErrorType.VALIDATION]: ErrorMessages.VALIDATION_ERROR,
  [ErrorType.AUTHENTICATION]: ErrorMessages.UNAUTHORIZED,
  [ErrorType.AUTHORIZATION]: ErrorMessages.FORBIDDEN,
  [ErrorType.NOT_FOUND]: ErrorMessages.NOT_FOUND,
  [ErrorType.DATABASE]: ErrorMessages.DATABASE_ERROR,
  [ErrorType.INTERNAL]: ErrorMessages.INTERNAL_ERROR,
  [ErrorType.TOKEN_EXPIRED]: ErrorMessages.TOKEN_EXPIRED,
  [ErrorType.INVALID_TOKEN]: ErrorMessages.TOKEN_INVALID,
  [ErrorType.DUPLICATE]: ErrorMessages.DUPLICATE_EMAIL,
  [ErrorType.NETWORK]: ErrorMessages.NETWORK_ERROR,
  [ErrorType.UNKNOWN]: ErrorMessages.UNKNOWN_ERROR,
  [ErrorType.SERVER]: ErrorMessages.SERVER_ERROR
};

export function getErrorMessage(type: ErrorType): string {
  return errorTypeToMessage[type] || ErrorMessages.UNKNOWN_ERROR;
} 