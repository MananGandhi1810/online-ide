import { Router } from "express";
import { checkAuth } from "../middlewares/auth.js";
import {
    queueCodeHandler,
    checkExecutionHandler,
    aiHelperHandler,
} from "../handlers/code.js";
import { rateLimit } from "../middlewares/rate-limit.js";

const router = Router();

router.post(
    "/submit/:problemStatementId/:language",
    checkAuth,
    (req, res, next) => rateLimit(req, res, next, 5, "code-execution"),
    (req, res) => queueCodeHandler(req, res),
);
router.post(
    "/run/:problemStatementId/:language",
    checkAuth,
    (req, res, next) => rateLimit(req, res, next, 3, "code-submission"),
    (req, res) => queueCodeHandler(req, res, true),
);
router.get("/check/:submissionId", checkAuth, (req, res) =>
    checkExecutionHandler(req, res),
);
router.get("/checkTemp/:submissionId", checkAuth, (req, res) =>
    checkExecutionHandler(req, res, true),
);
router.post("/ai/:problemStatementId/:language", checkAuth, aiHelperHandler);

export default router;
