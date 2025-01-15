import { Router } from "express";
import { userDataHandler, getUserByIdHandler, listUsers, addUser, editUser, deleteUser } from "../handlers/user.js";
import { checkAuth } from "../middlewares/auth.js";

const router = Router();

router.get("/", checkAuth, userDataHandler);
router.get("/:id", (req, res, next) => checkAuth(req, res, next, true), getUserByIdHandler);

router.get("/list", checkAuth, listUsers);
router.post("/add", checkAuth, addUser);
router.put("/edit/:id", checkAuth, editUser);
router.delete("/delete/:id", checkAuth, deleteUser);

export default router;