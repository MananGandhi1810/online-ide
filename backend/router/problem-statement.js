import { Router } from "express";
import { checkAuth } from "../middlewares/auth.js";
import {
    getProblemStatements,
    getProblemStatementById,
    newProblemStatement,
    editProblemStatement,
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
    "/edit/:id",
    (req, res, next) => checkAuth(req, res, next, true),
    editProblemStatement,
);

export default router;
