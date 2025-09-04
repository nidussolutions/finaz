import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Subscription } from '../entities/Subscription.js';
import { Transaction } from '../entities/Transaction.js';

const url = process.env.DATABASE_URL!;
if (!url) {
  throw new Error('DATABASE_URL não definida');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url,
  synchronize: false, // usar migrations!
  logging: false,
  entities: [User, Subscription, Transaction],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});
