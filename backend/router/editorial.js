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

const router = Router({ mergeParams: true });

router.use(checkAuth);
router.use(checkProblemStatement);

router.get("/", getEditorials);
router.get("/:editorialId", getEditorialById);
router.post("/new", newEditorial);
router.delete("/:editorialId/delete", deleteEditorial);
router.put("/:editorialId/update", updateEditorial);

export default router;
