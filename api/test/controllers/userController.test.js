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

describe('user follows', () => {
  it('allows a user to follow another', async () => {
    const response = await request
      .post('/api/v1/follow/2')
      .set('Authorization', `Bearer ${token}`)
    const { status, data: { statusCode, message, payload } } = response.body;
    expect(status).toEqual('success')
    expect(statusCode).toBe(201)
    expect(message).toEqual('You just followed this user')
    expect(payload).toBeDefined()
  });

  it('stops a user from following himself', async () => {
    const response = await request
      .post('/api/v1/follow/1')
      .set('Authorization', `Bearer ${token}`)
    const { status, data: { statusCode, message, payload } } = response.body;
    expect(status).toEqual('failure')
    expect(statusCode).toBe(401)
    expect(message).toEqual('You cannot follow yourself')
    expect(payload).toBeFalsy()
  })


  it('stops a user from following the same user more than once', async () => {
    const response = await request
      .post('/api/v1/follow/2')
      .set('Authorization', `Bearer ${token}`)
    const { status, data: { statusCode, message, payload } } = response.body;
    expect(status).toEqual('failure')
    expect(statusCode).toBe(409)
    expect(message).toEqual('You already follow this user')
    expect(payload).toBeFalsy()
  })
});


describe('timeline views', () => {
  it('allows a user view his timeline', async () => {
    const response = await request
      .get('/api/v1/user/1')
      .set('Authorization', `Bearer ${token}`)
    const { status, data: { statusCode, message, payload } } = response.body;
    if (response.body.data.payload === 0) {
      expect(status).toEqual('success')
      expect(statusCode).toBe(200)
      expect(message).toEqual('No tweets yet')
      expect(payload).toBeDefined()
    } else {
      expect(status).toEqual('success')
      expect(statusCode).toBe(201)
      expect(message).toEqual('User timeline')
      expect(payload).toBeDefined()
    }
  });

  it('stops a user from viewing another user\'s timeline', async () => {
    const response = await request
      .get('/api/v1/user/2')
      .set('Authorization', `Bearer ${token}`)
    const { status, data: { statusCode, message, payload } } = response.body;
    expect(status).toEqual('failure')
    expect(statusCode).toBe(401)
    expect(message).toEqual('You can only view your own timeline')
    expect(payload).toBeFalsy()
  })
});
