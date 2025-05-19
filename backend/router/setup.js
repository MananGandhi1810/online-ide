import { Router } from "express";
import createFirstAdminHandler from "../handlers/setup-admin.js";

const router = Router();

// Route to create the first admin user
router.post("/create-first-admin", createFirstAdminHandler);

export default router;
