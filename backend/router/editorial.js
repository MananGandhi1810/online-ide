import { Router } from "express";
import {
    getEditorials,
    getEditorialById,
    newEditorial,
    deleteEditorial,
    updateEditorial,
} from "../handlers/editorial.js";
import { checkAuth } from "../middlewares/auth.js";
import { checkProblemStatement } from "../middlewares/problem-statement.js";

const router = Router();

router.get(
    "/:problemStatementId/",
    checkAuth,
    checkProblemStatement,
    getEditorials,
);
router.get(
    "/:problemStatementId/:editorialId",
    checkAuth,
    checkProblemStatement,
    getEditorialById,
);
router.post(
    "/:problemStatementId/new",
    checkAuth,
    checkProblemStatement,
    newEditorial,
);
router.delete(
    "/:problemStatementId/:editorialId/delete",
    checkAuth,
    checkProblemStatement,
    deleteEditorial,
);
router.put(
    "/:problemStatementId/:editorialId/update",
    checkAuth,
    checkProblemStatement,
    updateEditorial,
);

export default router;
