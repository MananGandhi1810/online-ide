import { Router } from "express";
import { checkAuth } from "../middlewares/auth.js";
import { queueCode, checkExecution } from "../handlers/code.js";

var router = Router();

router.post("/submit/:problemStatementId/:language", checkAuth, (req, res) =>
    queueCode(req, res),
);
router.post("/run/:problemStatementId/:language", checkAuth, (req, res) =>
    queueCode(req, res, true),
);
router.get("/check/:submissionId", checkAuth, (req, res) =>
    checkExecution(req, res),
);
router.get("/checkTemp/:submissionId", checkAuth, (req, res) =>
    checkExecution(req, res, true),
);

export default router;
