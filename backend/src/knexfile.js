import 'dotenv/config';

const common = {
  client: 'pg',
  migrations: {
    directory: './database/migrations',
    extension: 'js',
  },
  seeds: {
    directory: './database/seeds',
    extension: 'js',
  },
  pool: { min: 2, max: 10 },
};

export default {
  development: {
    ...common,
    connection: 'postgresql://postgres:0109@127.0.0.1:5432/finaz',
    debug: true,
  },

  production: {
    ...common,
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: false,
    },
  },
};
