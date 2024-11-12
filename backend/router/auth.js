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

const router = Router();

router.post("/register", registerHandler);
router.get("/verify", verifyHandler);
router.post("/login", loginHandler);
router.post("/resend-verification", resendVerificationHandler);
router.post("/forgot-password", forgotPasswordHandler);
router.post("/verify-otp", verifyOtpHandler);
router.post("/reset-password", resetPasswordHandler);
router.get("/gh-callback", githubCallbackHandler);
router.get("/accessToken", accessTokenHandler);

export default router;
