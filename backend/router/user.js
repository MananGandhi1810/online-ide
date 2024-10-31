import { Router } from "express";
import { userDataHandler, getUserByIdHandler } from "../handlers/user.js";

import { checkAuth } from "../middlewares/auth.js";

const router = Router();

router.get("/", checkAuth, userDataHandler);
router.get("/:id", getUserByIdHandler);

export default router;
