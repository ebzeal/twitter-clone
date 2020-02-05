/* eslint-disable no-undef */
/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable indent */
import supertest from 'supertest';
import mongoose from 'mongoose';
import tokenHelp from '../../helpers/tokenHelp'

import app from '../../..';
import { token } from '../utils/constantUtils';
import userDB from '../../models/User';

const User = userDB;

const request = supertest(app);

beforeAll(async () => {
  const newUser = new User({
    _id: '5e396f0dbe77b11373fc327c',
    email: 'barln@ney.com',
    userName: 'barnleys',
    phone: '+2348099678900',
    password: 'barney.2S',
    confirmPassword: 'barney.2S',
  });
  const anotherUser = new User({
    _id: '5e396f2dbe77b11373fc327e',
    email: 'bakky@ney.com',
    userName: 'bakky',
    phone: '2348037508582',
    password: 'barney.2S',
    confirmPassword: 'barney.2S',
  })
  await newUser.save();
  await anotherUser.save();
})

afterAll(async () => {
  await mongoose.connect(process.env.DATABASE_URL_TEST);
  await mongoose.connection.collection('users').drop()
  await new Promise((resolve) => setTimeout(() => resolve(), 1000));
})

describe('user follows', () => {
  it('allows a user to follow another', async () => {
    const response = await request
      .post('/api/v1/follow/5e396f2dbe77b11373fc327e')
      .set('Authorization', `Bearer ${token}`)
    const { status, data: { statusCode, message, payload } } = response.body;
    expect(status).toEqual('success')
    expect(statusCode).toBe(201)
    expect(message).toEqual('You just followed this user')
    expect(payload).toBeFalsy()
  });
})


describe('timeline views', () => {
  jest.setTimeout(30000);
  it('stops a user from viewing another user\'s timeline', async () => {
    const response = await request
      .get('/api/v1/user/5e396f2dbe77b11373fc327e')
      .set('Authorization', `Bearer ${token}`)
    const { status, data: { statusCode, message, payload } } = response.body;
    expect(status).toEqual('failure')
    expect(statusCode).toBe(401)
    expect(message).toEqual('You can only view your own timeline')
    expect(payload).toBeFalsy()
  })
});
