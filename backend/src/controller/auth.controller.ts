import { Response } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthReq } from '../middlewares/auth';
import type {
  SignupBody,
  SignupResponse,
  LoginBody,
  LoginResponse,
} from '../domain/dto/auth.dto';

export function signup(req: AuthReq, res: Response<SignupResponse>) {
  const body = req.body as SignupBody;
  // Chamar a criação de usuário e geração de token
  const token = jwt.sign(
    {
      sub: 'new-user-id',
    },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  res.status(201).json({ token });
}

export function login(req: AuthReq, res: Response<LoginResponse>) {
  const body = req.body as LoginBody;
  // Chamar a validação de usuário e geração de token
  const token = jwt.sign(
    {
      sub: 'existing-user-id',
    },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
  res.status(200).json({ token });
}
