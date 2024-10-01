import { Router } from "express";
import { checkAuth } from "../middlewares/auth.js";
import {
    getProblemStatements,
    getProblemStatementById,
    newProblemStatement,
} from "../handlers/problem-statement.js";

var router = Router();

router.get("/problem-statements/all", checkAuth, getProblemStatements);
router.get(
    "/problem-statements/:problemStatementId",
    checkAuth,
    getProblemStatementById,
);
router.post(
    "/problem-statements/new",
    (req, res, next) => checkAuth(req, res, next, true),
    newProblemStatement,
);

export default router;
