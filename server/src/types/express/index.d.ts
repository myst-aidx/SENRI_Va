// Express の Request 型に user プロパティを追加する
declare namespace Express {
  export interface Request {
    user?: { id: string; [key: string]: any };
  }
} 