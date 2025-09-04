// dashboard.router.ts: controla as rotas relacionadas ao dashboard
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('Dashboard endpoint');
});

router.get('/timeline', (req, res) => {
  res.send('Dashboard timeline endpoint');
});

export default router;
