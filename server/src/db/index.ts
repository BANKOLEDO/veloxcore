import pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/veloxcore',
  connectionTimeoutMillis: 10000,
  ...(process.env.DATABASE_URL
    ? {
        ssl:
          process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: true }
            : { rejectUnauthorized: false },
      }
    : {}),
})

pool.on('error', (err) => {
  console.error('pg pool error:', err)
})

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      product_id TEXT NOT NULL,
      product_title TEXT NOT NULL,
      product_category TEXT NOT NULL,
      product_description TEXT,
      rating INTEGER NOT NULL,
      text TEXT NOT NULL,
      explanation TEXT,
      reasoning_steps TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS recommendations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      context_query TEXT,
      context_category TEXT,
      explanation TEXT,
      reasoning_steps TEXT,
      items TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS ratings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      product_id TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      recommendation_id INTEGER REFERENCES recommendations(id),
      product_id TEXT NOT NULL,
      action TEXT NOT NULL CHECK(action IN ('click', 'purchase', 'dismiss')),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `)
}

export function getPool() {
  return pool
}
