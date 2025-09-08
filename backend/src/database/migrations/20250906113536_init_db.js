/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up (knex) {
  // extensão para UUID no Postgres
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

  // tabela de usuários
  await knex.schema.createTable('users', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('name');
    t.string('email').notNullable().unique();
    t.string('password_hash').notNullable();
    t.enu('plan', ['free', 'pro']).notNullable().defaultTo('free');
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // tabela de categorias
  await knex.schema.createTable('categories', (t) => {
    t.increments('id').primary();
    t.uuid('user_id').references('users.id').onDelete('CASCADE');
    t.string('name').notNullable();
    t.enu('type', ['income', 'expense']).notNullable();
  });

  // tabela de transações
  await knex.schema.createTable('transactions', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id').references('users.id').onDelete('CASCADE');
    t.integer('category_id').references('categories.id').nullable().onDelete('SET NULL');
    t.enu('type', ['income', 'expense']).notNullable();
    t.decimal('amount', 14, 2).notNullable();
    t.date('date').notNullable();
    t.string('description');
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.index(['user_id', 'date']);
  });

  // tabela de tags
  await knex.schema.createTable('tags', (t) => {
    t.increments('id').primary();
    t.uuid('user_id').references('users.id').onDelete('CASCADE');
    t.string('name').notNullable();
    t.unique(['user_id', 'name']);
  });

  // relação n–n entre transações e tags
  await knex.schema.createTable('transaction_tags', (t) => {
    t.uuid('transaction_id').references('transactions.id').onDelete('CASCADE');
    t.integer('tag_id').references('tags.id').onDelete('CASCADE');
    t.primary(['transaction_id', 'tag_id']);
  });

  // tabela de assinaturas
  await knex.schema.createTable('subscriptions', (t) => {
    t.increments('id').primary();
    t.uuid('user_id').references('users.id').onDelete('CASCADE');
    t.enu('status', ['active', 'canceled', 'past_due']).notNullable().defaultTo('active');
    t.string('provider').notNullable().defaultTo('manual');
    t.timestamp('started_at').defaultTo(knex.fn.now());
    t.timestamp('ends_at').nullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down (knex) {
  await knex.schema
    .dropTableIfExists('transaction_tags')
    .dropTableIfExists('tags')
    .dropTableIfExists('transactions')
    .dropTableIfExists('categories')
    .dropTableIfExists('subscriptions')
    .dropTableIfExists('users');
}
