import { Router } from "express";
import { checkAuth } from "../middlewares/auth.js";
import { queueCodeHandler, checkExecutionHandler } from "../handlers/code.js";

var router = Router();

router.post("/submit/:problemStatementId/:language", checkAuth, (req, res) =>
    queueCodeHandler(req, res),
);
router.post("/run/:problemStatementId/:language", checkAuth, (req, res) =>
    queueCodeHandler(req, res, true),
);
router.get("/check/:submissionId", checkAuth, (req, res) =>
    checkExecutionHandler(req, res),
);
router.get("/checkTemp/:submissionId", checkAuth, (req, res) =>
    checkExecutionHandler(req, res, true),
);

export default router;
