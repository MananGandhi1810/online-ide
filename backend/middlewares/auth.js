import prisma from "db-interface";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { exists } from "../utils/keyvalue-db.js";

dotenv.config();
const jwtSecret = process.env.SECRET_KEY;

const checkAuth = async (req, res, next, admin = false) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(403).json({
            success: false,
            message: "Authorization header is missing",
            data: null,
        });
    }
    const token = authorization.replace("Bearer ", "");
    if (!token || token == "null") {
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
        return res.status(500).send({
            success: false,
            message: "There was an error in verifying your account",
            data: null,
        });
    }
    if (jwtUser.scope == "request") {
        return res.status(401).send({
            success: false,
            message: "Invalid token",
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
        (await exists(otpRedisId)) || (await exists(passwordChangeRedisId));
    if (resetReqExists) {
        return res.status(403).json({
            success: false,
            message: "A password reset for this account has been requested",
            data: null,
        });
    }
    if (admin && !user.admin) {
        return res.status(403).json({
            success: false,
            message: "Cannot access this route",
            data: null,
        });
    }
    user.password = undefined;
    req.user = user;
    next();
};

export { checkAuth };
