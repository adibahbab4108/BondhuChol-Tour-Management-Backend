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
//Frontend->forget password->email->user state check -> short expiration token(valid for 10 min)
// ->email->frontend link http://localhost:5173/reset-password?email=adib@gmail.com&token=token
//Backend-> extract email and token from query->take new password from user->reset-password api
// -> authorization = token->new password->token verify-> password hash ->save user password
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
