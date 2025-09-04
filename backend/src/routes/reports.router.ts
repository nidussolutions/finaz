// reports.router.ts: controla as rotas relacionadas a relatórios
import { Router } from 'express';

const router = Router();

router.get('/csv', (req, res) => {
  res.send('Reports CSV endpoint');
});

router.get('/pdf', (req, res) => {
  res.send('Reports PDF endpoint');
});

export default router;
