// auth.router.ts: controla as rotas relacionadas à autenticação
import { Router, Response } from 'express';
import { login, signup } from '../controller/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/signup', signup);

export default router;
