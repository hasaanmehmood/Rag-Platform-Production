import pg from 'pg';
import { config } from '../../config/index.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.database.url,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('New database connection established');
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

export const query = async <T = any>(
  text: string,
  params?: any[]
): Promise<pg.QueryResult<T>> => {
  const start = Date.now();
  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    console.log('Query executed:', { text: text.substring(0, 50), duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

export const getClient = async () => {
  return await pool.connect();
};

export const closePool = async () => {
  await pool.end();
  console.log('Database pool closed');
};

export default { query, getClient, closePool };