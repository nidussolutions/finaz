// transactions.router.ts: controla as rotas de transações
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('Get all transactions');
});

router.post('/', (req, res) => {
  res.send('Create a new transaction');
});

router.put('/:id', (req, res) => {
  res.send(`Update transaction with ID ${req.params.id}`);
});

router.delete('/:id', (req, res) => {
  res.send(`Delete transaction with ID ${req.params.id}`);
});

export default router;
