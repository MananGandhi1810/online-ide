import { Router } from "express";
import { checkAuth } from "../middlewares/auth.js";

var router = Router();

router.post("/getAllProblems", checkAuth, (req, res) => {
    res.json({ success: true, message: "Questions loaded", data: {} });
});

export default router;
