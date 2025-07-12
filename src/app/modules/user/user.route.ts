
import { Router } from "express";
import { userController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";


const userRoutes = Router();
// /api/v1/users"
userRoutes.post(
  "/register",
  validateRequest(createUserZodSchema),
  userController.createUser
);
userRoutes.get("/all-users", userController.getAllUsers);

export default userRoutes;
