/* eslint-disable indent */
import redisClient from '../../config/redisConfig';
import response from '../../helpers/resHelp';


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
