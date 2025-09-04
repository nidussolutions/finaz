import express from 'express';
import { env } from './config/env';
import { errorMiddleware } from './middlewares/error;
import authRouter from './modules/auth/auth.router;
import txRouter from './modules/tx/tx.router;
import dashboardRouter from './modules/dashboard/dashboard.router;
import reportsRouter from './modules/reports/reports.router;

const app = express();
// app.use(helmet());
// app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/tx', txRouter);
app.use('/dashboard', dashboardRouter);
app.use('/reports', reportsRouter);

app.use(errorMiddleware);
export default app;
