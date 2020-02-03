/* eslint-disable no-undef */
/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable indent */
import supertest from 'supertest';

import app from '../../..';
import { token } from '../utils/constantUtils';
import query from '../../config/dbConnection';

const request = supertest(app);

afterAll(async () => {
  await query('DELETE FROM follows WHERE follower_id=$1', [1])
})

describe('full search', () => {
  it('allows search of users and tweets', async () => {
    const response = await request
      .get('/api/v1/search?keyword=mo')
      .set('Authorization', `Bearer ${token}`)
    const { status, data: { statusCode, message, payload } } = response.body;
    expect(status).toEqual('success')
    expect(statusCode).toBe(201)
    expect(message).toEqual(expect.stringContaining('All results with the keyword'))
    expect(payload).toBeDefined()
  });
});
