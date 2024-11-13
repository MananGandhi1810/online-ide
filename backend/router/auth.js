import { Router } from "express";
import {
    registerHandler,
    verifyHandler,
    loginHandler,
    resendVerificationHandler,
    forgotPasswordHandler,
    resetPasswordHandler,
    verifyOtpHandler,
    githubCallbackHandler,
    accessTokenHandler,
} from "../handlers/auth.js";
import { rateLimit } from "../middlewares/rate-limit.js";

const router = Router();

router.post(
    "/register",
    (req, res, next) => rateLimit(req, res, next, 2, "register"),
    registerHandler,
);
router.get("/verify", verifyHandler);
router.post(
    "/login",
    (req, res, next) => rateLimit(req, res, next, 4, "login"),
    loginHandler,
);
router.post("/resend-verification", resendVerificationHandler);
router.post(
    "/forgot-password",
    (req, res, next) => rateLimit(req, res, next, 2, "password-reset"),
    forgotPasswordHandler,
);
router.post("/verify-otp", verifyOtpHandler);
router.post("/reset-password", resetPasswordHandler);
router.get("/gh-callback", githubCallbackHandler);
router.get("/accessToken", accessTokenHandler);

export default router;
