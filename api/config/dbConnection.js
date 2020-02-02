/* eslint-disable no-console */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-confusing-arrow */
import { Pool } from 'pg';
import env from 'dotenv';

env.config();

const connectionEnv = () =>
  process.env.NODE_ENV === 'test' ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionEnv(),
});
pool.on('connect', () => {
  console.log('Connected to DB');
});

/**
 * DB Query
 * @param {string} text
 * @param {Array} params
 * @returns {object} object
 */

const query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.log(err.stack);
  }
};

export default query;
