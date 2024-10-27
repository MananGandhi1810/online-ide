import { Router } from "express";
import { checkAuth } from "../middlewares/auth.js";
import { getLeaderboardHandler, getUserPointsHandler } from "../handlers/leaderboard.js";

var router = Router();

router.get("/", getLeaderboardHandler);
router.get("/getUserPoints", checkAuth, getUserPointsHandler);

export default router;
