import { Router } from "express";
import { checkAuth } from "../middlewares/auth.js";
import {
    getLeaderboardHandler,
    getUserPointsHandler,
} from "../handlers/leaderboard.js";

const router = Router();

router.get("/", getLeaderboardHandler);
router.get("/points", checkAuth, getUserPointsHandler);

export default router;
