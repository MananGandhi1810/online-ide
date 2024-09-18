import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();
const jwtSecret = process.env.SECRET_KEY;

const prisma = new PrismaClient();
const redis = createClient({ url: process.env.REDIS_URL });
redis.connect();

const checkAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(403).json({
            success: false,
            message: "Authorization header is missing",
            data: null,
        });
    }
    const token = authorization.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authorization bearer token is missing",
            data: null,
        });
    }
    var jwtUser;
    try {
        jwtUser = jwt.verify(token, jwtSecret);
    } catch (e) {
        return res.status(500).send({
            success: false,
            message: "There was an error in verifying your account",
            data: null,
        });
    }
    if (!jwtUser) {
        res.status(500).send({
            success: false,
            message: "There was an error in verifying your account",
            data: null,
        });
    }
    const user = await prisma.user.findUnique({
        where: {
            id: jwtUser.id,
            email: jwtUser.email,
        },
    });
    if (!user) {
        return res.status(403).json({
            success: false,
            message: "Could not verify user",
            data: null,
        });
    }
    if (!user.isVerified) {
        return res.status(403).json({
            success: false,
            message: "Please verify your account to continue",
            data: null,
        });
    }
    if (jwtUser.iat <= user.passwordUpdatedAt.getTime() / 1000) {
        return res.status(403).json({
            success: false,
            message: "Please login again after password update",
            data: null,
        });
    }
    const otpRedisId = `password-otp:${user.email}`;
    const passwordChangeRedisId = `allow-password-change:${user.email}`;
    const resetReqExists =
        (await redis.exists(otpRedisId)) ||
        (await redis.exists(passwordChangeRedisId));
    if (resetReqExists) {
        return res.status(403).json({
            success: false,
            message: "A password reset for this account has been requested",
            data: null,
        });
    }
    user.password = undefined;
    req.user = user;
    next();
};

export { checkAuth };
