import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });
redis.connect();

const rateLimit = async (req, res, next, limit = 5, use = "") => {
    const ip =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    const redisId = `rate-limit:${use}/${ip}`;
    const requests = await redis.incr(redisId);
    if (requests === 1) {
        await redis.expire(redisId, 60);
    }
    if (requests > limit) {
        res.locals.message = "Rate limit exceeded";
        return res.status(429).json({
            success: false,
            message: "Requests over limit, please wait for some time.",
            data: null,
        });
    }
    next();
};

export { rateLimit };
