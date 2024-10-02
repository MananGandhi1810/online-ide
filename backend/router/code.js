import { Router } from "express";
import { checkAuth } from "../middlewares/auth.js";
import { queueCode, checkExecution } from "../handlers/code.js";

var router = Router();

router.post("/submit/:problemStatementId/:language", checkAuth, queueCode);
router.get("/check/:submissionId", checkAuth, checkExecution);

export default router;
