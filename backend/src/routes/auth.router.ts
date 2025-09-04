// auth.router.ts: controla as rotas relacionadas à autenticação
import { Router } from 'express';

const router = Router();

router.post('/login', (req, res) => {
  res.send('Login endpoint');
});

router.post('/register', (req, res) => {
  res.send('Register endpoint');
});

export default router;
