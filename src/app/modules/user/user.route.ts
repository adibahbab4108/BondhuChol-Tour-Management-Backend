import { Router } from "express";
import { userController } from "./user.controller";

const userRoutes = Router();
// /api/v1/users"
userRoutes.post("/register", userController.createUser);
userRoutes.get("/all-users", userController.getAllUsers);

export default userRoutes;
