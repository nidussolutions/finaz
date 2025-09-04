import 'dotenv/config';
import express from 'express';

import transactionsRouter from './routes/transactions.router';
import authRouter from './routes/auth.router';
import dashboardRouter from './routes/dashboard.router';
import reportsRouter from './routes/reports.router';

const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json());
app.use('/api', authRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/reports', reportsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
