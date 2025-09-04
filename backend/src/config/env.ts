export const env = {
  PORT: Number(process.env.PORT || 4001),
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  FREE_MONTHLY_LIMIT: Number(process.env.FREE_MONTHLY_LIMIT || 100),
};
