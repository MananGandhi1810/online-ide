import { createClient } from "redis";
import { getIp } from "../utils/ip-addr.js";

const redis = createClient({ url: process.env.REDIS_URL });
redis.connect();

const rateLimit = async (req, res, next, limit = 5, use = "") => {
    if (process.env.ENVIRONMENT == "development") {
        return next();
    }
    var key;
    if (req.user) {
        key = req.user.id;
    } else {
        key = getIp(req);
    }
    const redisId = `rate-limit:${use}/${key}`;
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
