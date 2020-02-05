/* eslint-disable no-undef */
/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable indent */
import supertest from 'supertest';
import mongoose from 'mongoose';

import app from '../../..';
import { token } from '../utils/constantUtils';
import tweetDB from '../../models/Tweet';

const Tweet = tweetDB;

const request = supertest(app);

const newTweet = {
  tweet: "POW!!!@mikail @kiloni 'We We' released in 1992 by Angelique Kidjo. Could have said Burna boy picked the@mbural Anybody Vibe from here. But I won't. Africa still winning. We are one.#KobeBryant #Grammy"
};


beforeAll(async () => {
  const aTweet = new Tweet(newTweet)
  await aTweet.save();
})

afterAll(async () => {
  await mongoose.connect(process.env.DATABASE_URL_TEST);
  await mongoose.connection.collection('tweets').drop()
  await mongoose.connection.collection('users').drop()
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
