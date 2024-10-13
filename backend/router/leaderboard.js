import { Router } from "express";
import { checkAuth } from "../middlewares/auth.js";
import { getCurrentStandings } from "../handlers/leaderboard.js";

var router = Router();

router.get("/", checkAuth, getCurrentStandings);

export default router;
