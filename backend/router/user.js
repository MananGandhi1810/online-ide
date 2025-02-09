import { Router } from "express";
import {
    userDataHandler,
    getUserByIdHandler,
    getUserSubmissionsHandler,
} from "../handlers/user.js";

import { checkAuth } from "../middlewares/auth.js";

const router = Router();

router.get("/", checkAuth, userDataHandler);
router.get("/submissions", checkAuth, getUserSubmissionsHandler);
router.get("/:id", getUserByIdHandler);

export default router;
