import { Router } from "express";
import { userController } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "./user.interface";
const UserRoutes = Router();

// /api/v1/users/register"
UserRoutes.post(
  "/register",
  validateRequest(createUserZodSchema),
  userController.createUser
);
// /api/v1/users/:id"
UserRoutes.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userController.getAllUsers
);
UserRoutes.get("/me", checkAuth(...Object.values(Role)), userController.getMe);
UserRoutes.get(
  "/:id",
  checkAuth(...Object.values(Role)),
  userController.getSingleUser
);
UserRoutes.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  userController.updateUser
);

export default UserRoutes;
