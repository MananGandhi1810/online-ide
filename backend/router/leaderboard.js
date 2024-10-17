import { Router } from "express";
import { checkAuth } from "../middlewares/auth.js";
import { getCurrentStandings, getUserPoints } from "../handlers/leaderboard.js";

var router = Router();

router.get("/", checkAuth, getCurrentStandings);
router.get("/getUserPoints", checkAuth, getUserPoints);

export default router;
