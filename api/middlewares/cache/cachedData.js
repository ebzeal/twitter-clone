/* eslint-disable indent */

import redis from 'redis';
import response from '../../helpers/resHelp';

const portRedis = process.env.REDIS_URI || 6379;

const host = process.env.NODE_ENV === 'production' ? { host: 'redis' } : null;

const redisClient = redis.createClient({ host, port: portRedis });
// const redisClient = redis.createClient(portRedis);

const cachedSearch = (req, res, next) => {
    const { keyword } = req.query;
    redisClient.get(keyword, (error, cachedData) => {
        if (error) throw error;
        if (cachedData != null) {
            res.send(response(res, 201, 'success', `All results with the keyword '${keyword}' `, '', cachedData));
        } else {
            next();
        }
    });
};

const cachedReadTweet = (req, res, next) => {
    const { id } = req.params;
    redisClient.get(id, (error, cachedData) => {
        if (error) throw error;
        if (cachedData != null) {
            res.send(response(res, 201, 'success', 'Tweet retrieved', '', cachedData));
        } else {
            next();
        }
    });
};


const cachedTimeline = (req, res, next) => {
    const { id } = req.params;
    redisClient.get(id, (error, cachedData) => {
        if (error) throw error;
        if (cachedData != null) {
            res.send(response(res, 201, 'success', 'Tweet retrieved', '', cachedData));
        } else {
            next();
        }
    });
};


export {
    cachedSearch,
    cachedReadTweet,
    cachedTimeline
};
