import { Router } from "express";
import { checkAuth } from "../middlewares/auth.js";
import {
    getAllUsersHandler,
    toggleUserAdminStatusHandler,
    getUserSubmissionsAdminHandler,
    getProblemStatementsAdminHandler,
    getAdminDashboardStatsHandler,
    moderateProblemStatementHandler,
    banUserHandler
} from "../handlers/admin.js";

const router = Router();

// Admin middleware to check if user has admin privileges
const adminAuth = (req, res, next) => checkAuth(req, res, next, true);

// Dashboard routes
router.get("/dashboard/stats", adminAuth, getAdminDashboardStatsHandler);

// User management routes
router.get("/users", adminAuth, getAllUsersHandler);
router.put("/users/:userId/toggle-admin", adminAuth, toggleUserAdminStatusHandler);
router.get("/users/:userId/submissions", adminAuth, getUserSubmissionsAdminHandler);
router.post("/users/:userId/ban", adminAuth, banUserHandler);

// Problem statement management routes
router.get("/problem-statements", adminAuth, getProblemStatementsAdminHandler);
router.put("/problem-statements/:problemId/moderate", adminAuth, moderateProblemStatementHandler);

export default router;