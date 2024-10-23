import { Router } from "express";
import { userDataHandler } from "../handlers/user.js";

import { checkAuth } from "../middlewares/auth.js";

var router = Router();

router.get("/", checkAuth, userDataHandler);

export default router;
