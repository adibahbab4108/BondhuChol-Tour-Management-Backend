/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVar } from "../../config/env.config";

const AuthRoutes = Router();
AuthRoutes.post("/login", AuthControllers.credentialsLogin);

AuthRoutes.post("/refresh-token", AuthControllers.getNewAccessToken);
AuthRoutes.post("/logout", AuthControllers.logout);
AuthRoutes.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.changePassword
);
AuthRoutes.post(
  "/set-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.setPassword
);

// [Frontend] POST /forgot-password → verify user → generate 10min token → send email with reset link → user clicks link → [Frontend] GET /reset-password?email&token → (optional) verify token → [Frontend] POST /reset-password with email, token, newPassword → [Backend] verify token → hash password → update user → respond success

AuthRoutes.post("/forgot-password", AuthControllers.forgotPassword);
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
  passport.authenticate("google", {
    failureRedirect: `${envVar.FRONTEND_URL}/login?error=There is some issues with your account. PLease contact with support team`,
  }),
  AuthControllers.googleCallbackController
);
export default AuthRoutes;
