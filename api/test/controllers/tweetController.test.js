/* eslint-disable no-undef */
/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable indent */
import supertest from 'supertest';

import app from '../../..';
import query from '../../config/dbConnection';
import { token } from '../utils/constantUtils';

const request = supertest(app);

const newTweet = {
    tweet: "POW!!!@mikail @kiloni 'We We' released in 1992 by Angelique Kidjo. Could have said Burna boy picked the@mbural Anybody Vibe from here. But I won't. Africa still winning. We are one.#KobeBryant #Grammy"
};

const userTweet = {
    id: 15,
    user_id: 1,
    tweet: "POW!!! @mikail @kiloni Anybody Vibe from here. But I won't. Africa still winning. We are one. #GRAMMYAwards2020 #Burna #KobeBryant #Grammy"
};

const newReply = {
    reply: "@ade_koya, make good music, sing your native song and teach the world your values through music @burna. We focus more on crime and money. Burna performance of killing 'em was with life band and we saw quality. Why can't this continue in shows w/out DJs? #Grammy #Burna"
};

beforeAll(async () => {
    await query('INSERT INTO tweets(id, user_id, tweet)VALUES($1, $2, $3) returning *', [userTweet.id, userTweet.user_id, userTweet.tweet]);
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
            .get('/api/v1/tweet/15')
            .set('Authorization', `Bearer ${token}`)
        const { status, data: { statusCode, message, payload } } = response.body;
        expect(status).toEqual('success')
        expect(statusCode).toBe(201)
        expect(message).toEqual('Tweet retrieved')
        expect(payload).toBeDefined()
    })


    it('should fail when finding a non-existent tweet', async () => {
        const response = await request
            .get('/api/v1/tweet/150')
            .set('Authorization', `Bearer ${token}`)
            .send()
        const { status, data: { statusCode, message, payload } } = response.body;
        expect(status).toEqual('failure')
        expect(statusCode).toBe(404)
        expect(message).toEqual('Tweet does not exist')
        expect(payload).toBeFalsy()
    })

    it('should reply tweet', async () => {
        const response = await request
            .post('/api/v1/tweet/15')
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
            .delete('/api/v1/tweet/2')
            .set('Authorization', `Bearer ${token}`)
        const { status, data: { statusCode, message, payload } } = response.body;
        expect(status).toEqual('failure')
        expect(statusCode).toBe(401)
        expect(message).toEqual('You cannot delete another user\'s tweet')
        expect(payload).toBeFalsy()
    })

    it('should delete a user\'s own tweet', async () => {
        const response = await request
            .delete('/api/v1/tweet/15')
            .set('Authorization', `Bearer ${token}`)
        const { status, data: { statusCode, message, payload } } = response.body;
        expect(status).toEqual('success')
        expect(statusCode).toBe(201)
        expect(message).toEqual('Tweet deleted')
        expect(payload).toBeFalsy()
    })
});
