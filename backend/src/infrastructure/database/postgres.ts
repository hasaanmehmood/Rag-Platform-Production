import pg from 'pg';
import { config } from '../../config/index.js';
import { logger } from '../../shared/logger.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.database.url,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  logger.debug('New database connection established');
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected database error');
});

export const query = async <T = any>(
  text: string,
  params?: any[]
): Promise<pg.QueryResult<T>> => {
  const start = Date.now();
  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    logger.debug({ text, duration, rows: result.rowCount }, 'Executed query');
    return result;
  } catch (error) {
    logger.error({ error, text }, 'Query error');
    throw error;
  }
};

export const getClient = async () => {
  return await pool.connect();
};

export const closePool = async () => {
  await pool.end();
  logger.info('Database pool closed');
};

export default { query, getClient, closePool };