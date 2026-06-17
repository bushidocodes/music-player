export const DATABASE_URI = process.env.NODE_ENV === 'production'
  ? process.env.POSTGRESQL_URI
  : 'postgres://localhost:5432/juke';
