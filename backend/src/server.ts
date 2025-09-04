import 'reflect-metadata';
import app from './app.js';
import { env } from './config/env';
import { AppDataSource } from './config/data-source.js';

AppDataSource.initialize()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`[api] running on :${env.PORT}`);
    });
  })
  .catch((e) => {
    console.error('DataSource init failed', e);
    process.exit(1);
  });
