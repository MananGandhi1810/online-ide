import { Router } from "express";
import { checkAuth } from "../middlewares/auth.js";
import {
    getProblemStatementsHandler,
    getProblemStatementByIdHandler,
    newProblemStatementHandler,
    editProblemStatementHandler,
    deleteProblemStatementHandler,
} from "../handlers/problem-statement.js";

var router = Router();

router.get("/all", checkAuth, getProblemStatementsHandler);
router.get("/:problemStatementId", checkAuth, getProblemStatementByIdHandler);
router.post(
    "/new",
    (req, res, next) => checkAuth(req, res, next, true),
    newProblemStatementHandler,
);
router.put(
    "/edit/:problemStatementId",
    (req, res, next) => checkAuth(req, res, next, true),
    editProblemStatementHandler,
);
router.delete(
    "/delete/:problemStatementId",
    (req, res, next) => checkAuth(req, res, next, true),
    deleteProblemStatementHandler,
);

export default router;
