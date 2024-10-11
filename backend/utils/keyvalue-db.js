import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });
redis.connect();

const exists = (key) => {
    return redis.exists(key);
};

const set = (key, value, ttl = -1) => {
    return redis.set(key, value, { EX: ttl });
};

const get = (key) => {
    return redis.get(key);
};

const del = (key) => {
    return redis.del(key);
};

export { exists, set, get, del };
