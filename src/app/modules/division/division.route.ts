import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { Role } from "../user/user.interface";
import { createDivisionSchema, updateDivisionSchema } from "./division.validation";
import { DivisionController } from "./division.controller";
import { multerUpload } from "../../config/multer.config";


const DivisionRoutes = Router();

DivisionRoutes.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(createDivisionSchema),
  DivisionController.createDivision
);
DivisionRoutes.get("/", DivisionController.getAllDivisions);
DivisionRoutes.get("/:slug", DivisionController.getSingleDivision);
DivisionRoutes.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
   multerUpload.single("file"),
  validateRequest(updateDivisionSchema),
  DivisionController.updateDivision
);
DivisionRoutes.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionController.deleteDivision
);
export default DivisionRoutes;
