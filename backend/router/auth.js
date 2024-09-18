import { Router } from "express";
import {
    registerHandler,
    verifyHandler,
    loginHandler,
    resendVerificationHandler,
    forgotPasswordHandler,
    resetPasswordHandler,
    verifyOtpHandler,
    userDataHandler,
} from "../handlers/auth.js";

import { checkAuth } from "../middlewares/auth.js";

var router = Router();

router.post("/register", registerHandler);
router.get("/verify", verifyHandler);
router.post("/login", loginHandler);
router.post("/resend-verification", resendVerificationHandler);
router.post("/forgot-password", forgotPasswordHandler);
router.post("/verify-otp", verifyOtpHandler);
router.post("/reset-password", resetPasswordHandler);
router.get("/user", checkAuth, userDataHandler);

export default router;
