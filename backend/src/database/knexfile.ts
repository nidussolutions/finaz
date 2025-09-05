import 'dotenv/config';
import type { Knex } from 'knex';

const shared = {
  client: 'pg',
  migrations: { directory: './migrations', extension: 'ts' },
  pool: { min: 2, max: 10 },
};

const config: { [key: string]: Knex.Config } = {
  development: {
    ...shared,
    connection: process.env.DATABASE_URL,
  },
  production: {
    ...shared,
    connection: process.env.DATABASE_URL,
  },
};

export default config;
