/* eslint-disable no-undef */
/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable indent */
import supertest from 'supertest';
import mongoose from 'mongoose';

import app from '../../..';
import { token } from '../utils/constantUtils';
import tweetDB from '../../models/Tweet';
import userDB from '../../models/User';

const Tweet = tweetDB;
const User = userDB;

const request = supertest(app);


const oneUser = {
    _id: '5e396f0dbe77b11373fc327c',
    email: 'barln@ney.com',
    userName: 'barnleys',
    phone: '+2348099678900',
    password: 'barney.2S',
    confirmPassword: 'barney.2S',
};

const newTweet = {
    _id: '5e3a42567e98ab24a76c62b6',
    tweet: "POW!!!@mikail @kiloni 'We We' released in 1992 by Angelique Kidjo. Could have said Burna boy picked the@mbural Anybody Vibe from here. But I won't. Africa still winning. We are one.#KobeBryant #Grammy"
};

const userTweet = {
    _id: '5e3971d2696a0813eb0d5409',
    tweet: "POW!!! @mikail @kiloni Anybody Vibe from here. But I won't. Africa still winning. We are one. #GRAMMYAwards2020 #Burna #KobeBryant #Grammy"
};

const newReply = {
    reply: "@ade_koya, make good music, sing your native song and teach the world your values through music @burna. We focus more on crime and money. Burna performance of killing 'em was with life band and we saw quality. Why can't this continue in shows w/out DJs? #Grammy #Burna"
};

beforeAll(async () => {
    const theUser = new User(oneUser)
    await theUser.save();
    const theUserTweet = new Tweet(userTweet)
    await theUserTweet.save();
})
afterAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL_TEST);
    await mongoose.connection.collection('users').drop()
    await mongoose.connection.collection('tweets').drop()
    await mongoose.connection.collection('tags').drop()
    await mongoose.connection.collection('mentions').drop()
})

describe('creating and using tweets/', () => {
    it('should post a new tweet', async () => {
        const response = await request
            .post('/api/v1/tweet')
            .set('Authorization', `Bearer ${token}`)
            .send(newTweet)
        const { status, data: { statusCode, message, payload } } = response.body;
        expect(status).toEqual('success')
        expect(statusCode).toBe(201)
        expect(message).toEqual('Tweet has been posted')
        expect(payload).toBeDefined()
    });

    it('should read a tweet', async () => {
        const response = await request
            .get('/api/v1/tweet/5e3971d2696a0813eb0d5409')
            .set('Authorization', `Bearer ${token}`)
        const { status, data: { statusCode, message, payload } } = response.body;
        expect(status).toEqual('success')
        expect(statusCode).toBe(201)
        expect(message).toEqual('Tweet retrieved')
        expect(payload).toBeDefined()
    })


    it('should fail when finding a non-existent tweet', async () => {
        const response = await request
            .get('/api/v1/tweet/5e397067eafe3b13a4d8194f')
            .set('Authorization', `Bearer ${token}`)
        const { status, data: { statusCode, message, payload } } = response.body;
        expect(status).toEqual('failure')
        expect(statusCode).toBe(404)
        expect(message).toEqual('Tweet does not exist')
        expect(payload).toBeFalsy()
    })

    it('should reply tweet', async () => {
        const response = await request
            .post('/api/v1/tweet/5e3971d2696a0813eb0d5409')
            .set('Authorization', `Bearer ${token}`)
            .send(newReply)
        const { status, data: { statusCode, message, payload } } = response.body;
        expect(status).toEqual('success')
        expect(statusCode).toBe(201)
        expect(message).toEqual('Your reply has been added')
        expect(payload).toBeDefined()
    })

    it('should not delete another user\'s tweet', async () => {
        const response = await request
            .delete('/api/v1/tweet/5e3971d2696a0813eb0d5409')
            .set('Authorization', `Bearer ${token}`)
        const { status, data: { statusCode, message, payload } } = response.body;
        expect(status).toEqual('failure')
        expect(statusCode).toBe(401)
        expect(message).toEqual('You cannot delete another user\'s tweet')
        expect(payload).toBeFalsy()
    })
});
