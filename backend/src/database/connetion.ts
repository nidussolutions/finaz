import knex, { type Knex } from 'knex';
import config from './knexfile';

const env = process.env.NODE_ENV ?? 'development';
const cfg = (config as Record<string, Knex.Config>)[env];

if (!cfg) {
  const available = Object.keys(config || {});
  throw new Error(
    `Knex config not found for NODE_ENV="${env}". Available: [${available.join(
      ', '
    )}]`
  );
}

const db: Knex = knex(cfg);
export default db;
