import winston from 'winston';

const { createLogger: winstonCreateLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize } = format;

const myFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  
  return msg;
});

export function createLogger(service: string) {
  return winstonCreateLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(
      colorize(),
      timestamp(),
      myFormat
    ),
    defaultMeta: { service },
    transports: [
      new transports.Console({
        format: combine(
          colorize(),
          timestamp(),
          myFormat
        ),
      }),
      // 本番環境では必要に応じてファイルへのログ出力も追加可能
      ...(process.env.NODE_ENV === 'production' ? [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' })
      ] : [])
    ],
  });
}

// デフォルトのロガーインスタンスをエクスポート
export const logger = createLogger('default'); 