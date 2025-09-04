import 'dotenv/config';
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Aqui extendemos o Request do Express para adicionar a propriedade userId
export interface AuthReq extends Request {
  userId?: string;
}

export function auth(req: AuthReq, res: Response, next: NextFunction) {
  const JWT_SECRET = process.env.JWT_SECRET;
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET!) as {
      sub: string;
    };
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
