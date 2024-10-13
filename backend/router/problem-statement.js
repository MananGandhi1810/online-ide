import { Router } from "express";
import { checkAuth } from "../middlewares/auth.js";
import {
    getProblemStatements,
    getProblemStatementById,
    newProblemStatement,
    editProblemStatement,
    deleteProblemStatement,
} from "../handlers/problem-statement.js";

var router = Router();

router.get("/all", checkAuth, getProblemStatements);
router.get("/:problemStatementId", checkAuth, getProblemStatementById);
router.post(
    "/new",
    (req, res, next) => checkAuth(req, res, next, true),
    newProblemStatement,
);
router.put(
    "/edit/:problemStatementId",
    (req, res, next) => checkAuth(req, res, next, true),
    editProblemStatement,
);
router.delete(
    "/delete/:problemStatementId",
    (req, res, next) => checkAuth(req, res, next, true),
    deleteProblemStatement,
);

export default router;
