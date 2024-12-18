import { Router } from "express";
import { checkAuth } from "../middlewares/auth.js";
import {
    getProblemStatementsHandler,
    getProblemStatementByIdHandler,
    newProblemStatementHandler,
    editProblemStatementHandler,
    deleteProblemStatementHandler,
    uploadProblem // New handler for uploading problem statements
} from "../handlers/problem-statement.js";

const router = Router();

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

// New route
router.post("/upload", (req, res, next) => checkAuth(req, res, next, true), uploadProblem);

export default router;