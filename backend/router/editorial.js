import { Router } from "express";
import {
    getEditorialsHandler,
    getEditorialByIdHandler,
    newEditorialHandler,
    deleteEditorialHandler,
    updateEditorialHandler,
} from "../handlers/editorial.js";
import { checkAuth } from "../middlewares/auth.js";
import { checkProblemStatement } from "../middlewares/problem-statement.js";

const router = Router({ mergeParams: true });

router.use(checkAuth);
router.use(checkProblemStatement);

router.get("/", getEditorialsHandler);
router.get("/:editorialId", getEditorialByIdHandler);
router.post("/new", newEditorialHandler);
router.delete("/:editorialId/delete", deleteEditorialHandler);
router.put("/:editorialId/update", updateEditorialHandler);

export default router;
