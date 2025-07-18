/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";

const AuthRoutes = Router();
AuthRoutes.post("/login", AuthControllers.credentialsLogin);

AuthRoutes.post("/refresh-token", AuthControllers.getNewAccessToken);
AuthRoutes.post("/logout", AuthControllers.logout);
AuthRoutes.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.resetPassword
);
AuthRoutes.get("/google", (req: Request, res: Response, next: NextFunction) => {
  const redirect = req.query.redirect || "/";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: redirect as string,
  })(req, res);
});

//api/v1/auth/google/callback?state=/booking
AuthRoutes.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  AuthControllers.googleCallbackController
);
export default AuthRoutes;
