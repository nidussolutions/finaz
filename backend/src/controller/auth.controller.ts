import { NextFunction, Response } from 'express';
import db from '../database/connetion';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { AuthReq } from '@/middlewares/auth';
import type {
  SignupBody,
  SignupResponse,
  LoginBody,
  LoginResponse,
} from '@dto/auth.dto';
import { AppError } from '@/utils/AppError';

export async function signup(
  req: AuthReq,
  res: Response<SignupResponse>,
  next: NextFunction
) {
  try {
    const body = req.body as SignupBody;

    const existing = await db('users').where({ email: body.email }).first();
    if (existing) {
      throw new AppError('E-mail já cadastrado', 400, 'EMAIL_TAKEN');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const [user] = await db('users')
      .insert({
        name: body.name,
        email: body.email,
        password_hash: hashedPassword,
      })
      .returning(['id', 'email']);

    if (!process.env.JWT_SECRET) {
      throw new AppError('JWT_SECRET not configured', 500, 'CONFIG_ERROR');
    }

    const token = jwt.sign({ sub: 'new-user-id' }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token });
  } catch (error) {
    next(new AppError('Failed to sign up user', 500, 'SIGNUP_ERROR'));
  }
}

export async function login(req: AuthReq, res: Response<LoginResponse>) {
  const body = req.body as LoginBody;

  if (!process.env.JWT_SECRET) {
    throw new AppError('JWT_SECRET not configured', 500, 'CONFIG_ERROR');
  }

  const [user] = await db('users').where({ email: body.email }).first();
  if (!user) {
    throw new AppError('Usuario não encontrado', 404, 'USER_NOT_FOUND');
  }

  const passwordMatch = await bcrypt.compare(body.password, user.password_hash);
  if (!passwordMatch) {
    throw new AppError('Senha incorreta', 401, 'INVALID_CREDENTIALS');
  }

  const token = jwt.sign(
    {
      sub: user.id,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
  res.status(200).json({ token });
}
