import { Router } from "express";
import { checkAuth } from "../middlewares/auth.js";
import { executeCode } from "../handlers/code.js";

var router = Router();

router.post("/submit/:language", checkAuth, executeCode);

export default router;
