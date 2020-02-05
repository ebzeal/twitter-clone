import redis from 'redis';

const portRedis = process.env.REDIS_URI || 6379;


const redisClient = process.env.NODE_ENV === 'production' ? redis.createClient({ host: 'redis', port: portRedis }) : redis.createClient({ port: portRedis });

export default redisClient;
