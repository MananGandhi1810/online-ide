import { Router } from "express";
import { userDataHandler, getUserByIdHandler } from "../handlers/user.js";

import { checkAuth } from "../middlewares/auth.js";

var router = Router();

router.get("/", checkAuth, userDataHandler);
router.get("/:id", checkAuth, getUserByIdHandler)

export default router;
