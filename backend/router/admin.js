import { Router } from "express";
import { checkAuth } from "../middlewares/auth.js";
import {
    getAllUsersHandler,
    toggleUserAdminStatusHandler,
    getUserStatsHandler,
} from "../handlers/admin.js";

const router = Router();

// All admin routes require admin privileges
router.use((req, res, next) => checkAuth(req, res, next, true));

// User management
router.get("/users", getAllUsersHandler);
router.patch("/users/:userId/toggle-admin", toggleUserAdminStatusHandler);

// Dashboard stats
router.get("/stats", getUserStatsHandler);

export default router;
