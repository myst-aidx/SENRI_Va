import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: TokenPayload, expiresIn: string = '24h'): string {
  return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', { expiresIn });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as TokenPayload;
} 