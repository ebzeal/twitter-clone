/* eslint-disable no-undef */
/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable indent */
import supertest from 'supertest';

import app from '../../..';
import query from '../../config/dbConnection';

const request = supertest(app);

const newUser = {
    email: 'barln@ney.com',
    userName: 'barnleys',
    phone: '+2348099678900',
    password: 'barney.2S',
    confirmPassword: 'barney.2S',
};

const userwithSameEmail = {
    email: 'barln@ney.com',
    userName: 'pauls',
    phone: '+2348099678901',
    password: 'paulse.2S',
    confirmPassword: 'paulse.2S',
};

const userwithSameUserName = {
    email: 'Paulsla@me.com',
    userName: 'barnleys',
    phone: '+2348099678902',
    password: 'paulse.2S',
    confirmPassword: 'paulse.2S',
};


const userWithSamePhoneNumber = {
    email: 'barlni@ney.com',
    userName: 'barnleysi',
    phone: '+2348099678900',
    password: 'barney.2Si',
    confirmPassword: 'barney.2Si',
};


const emailUser = {
    user: 'barln@ney.com',
    password: 'barney.2S',
};

const userNameUser = {
    user: 'barnleys',
    password: 'barney.2S',
};

const phoneNumberUser = {
    user: '+2348099678900',
    password: 'barney.2S',
};

const noUser = {
    user: 'barnleysmu',
    password: 'barney.2S',
};

const badPassword = {
    user: 'barnleys',
    password: 'barnly.2S',
};

afterAll(async () => {
    await query('DELETE FROM users WHERE userName=$1', [newUser.userName]);
});

describe('new user sign up POST/', () => {
    it('should return new user details', async () => {
        const response = await request
            .post('/api/v1/auth/signup')
            .send(newUser)
        const { status, data: { statusCode, message, payload } } = response.body;
        expect(status).toEqual('success')
        expect(statusCode).toBe(201)
        expect(message).toEqual('Account created successfully')
        expect(payload).toBeDefined()
    });

    it('should return error if email already exist', async () => {
        const response = await request
            .post('/api/v1/auth/signup')
            .send(userwithSameEmail)
        const { status, data: { statusCode, message, payload } } = response.body;
        expect(status).toEqual('failure')
        expect(statusCode).toBe(400)
        expect(message).toEqual('This user already exists')
        expect(payload).toBeFalsy()
    })

    it('should return error if username already exist', async () => {
        const response = await request
            .post('/api/v1/auth/signup')
            .send(userwithSameUserName)
        const { status, data: { statusCode, message, payload } } = response.body;
        expect(status).toEqual('failure')
        expect(statusCode).toBe(400)
        expect(message).toEqual('This username already exists')
        expect(payload).toBeFalsy()
    })

    it('should return error if phone Number already exist', async () => {
        const response = await request
            .post('/api/v1/auth/signup')
            .send(userWithSamePhoneNumber)
        const { status, data: { statusCode, message, payload } } = response.body;
        expect(status).toEqual('failure')
        expect(statusCode).toBe(400)
        expect(message).toEqual('This phone number is registered with another user')
        expect(payload).toBeFalsy()
    })
});

describe('user can login', () => {
    it('should log user in with email', async () => {
        const response = await request
            .post('/api/v1/auth/login')
            .send(emailUser)
        const { status, data: { statusCode, message, payload } } = response.body;
        expect(status).toEqual('success')
        expect(statusCode).toBe(200)
        expect(message).toEqual('You have successfully logged in')
        expect(payload).toBeDefined()
    })

    it('should log user in with username', async () => {
        const response = await request
            .post('/api/v1/auth/login')
            .send(userNameUser)
        const { status, data: { statusCode, message, payload } } = response.body;
        expect(status).toEqual('success')
        expect(statusCode).toBe(200)
        expect(message).toEqual('You have successfully logged in')
        expect(payload).toBeDefined()
    })

    it('should log user in with phone number', async () => {
        const response = await request
            .post('/api/v1/auth/login')
            .send(phoneNumberUser)
        const { status, data: { statusCode, message, payload } } = response.body;
        expect(status).toEqual('success')
        expect(statusCode).toBe(200)
        expect(message).toEqual('You have successfully logged in')
        expect(payload).toBeDefined()
    })

    it('should reject user with bad user details', async () => {
        const response = await request
            .post('/api/v1/auth/login')
            .send(noUser)
        const { status, data: { statusCode, message, payload } } = response.body;
        expect(status).toEqual('failure')
        expect(statusCode).toBe(404)
        expect(message).toEqual('Your login information is not correct')
        expect(payload).toBeFalsy()
    })

    it('should reject user with wrong password', async () => {
        const response = await request
            .post('/api/v1/auth/login')
            .send(badPassword)
        const { status, data: { statusCode, message, payload } } = response.body;
        expect(status).toEqual('failure')
        expect(statusCode).toBe(401)
        expect(message).toEqual('Your login information is not correct')
        expect(payload).toBeFalsy()
    })
})
