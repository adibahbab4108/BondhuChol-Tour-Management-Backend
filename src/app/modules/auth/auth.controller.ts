/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserToken } from "../../utils/userToken";
import { envVar } from "../../config/env.config";
import passport from "passport";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // const loginInfo = await AuthServices.credentialsLogin(req.body);

    // // res.cookie("accessToken", loginInfo.accessToken, {
    // //   httpOnly: true,
    // //   secure: false,
    // // });

    // // res.cookie("refreshToken", loginInfo.refreshToken, {
    // //   httpOnly: true,
    // //   secure: false,
    // // });

    //Or setAuthCookie(res, loginInfo);

    // sendResponse(res, {
    //   statusCode: 200,
    //   success: true,
    //   message: "User login successfully",
    //   data: loginInfo,
    // });

    passport.authenticate("local", async (err: any, user: any, info: any) => {
      console.log(err, user, info);
      if (err) return next(err);
      if (!user) return next(new AppError(info.message, 401));
      const userToken = createUserToken(user);
      setAuthCookie(res, userToken);

      const userObject = user.toObject();
      delete userObject.password;
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User logged in successfully",
        data: {
          accessToken: userToken.accessToken,
          refreshToken: userToken.refreshToken,
          user: userObject,
        },
      });
    })(req, res, next);
  }
);
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // const refreshToken = req.headers.authorization;
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError("No refresh token received from cookies", 401);
    }
    const tokenInfo = await AuthServices.getNewAccessToken(
      refreshToken as string
    );

    //  res.cookie("accessToken", tokenInfo.accessToken, {
    //   httpOnly: true,
    //   secure: false,
    // });
    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "New Token created successfully",
      data: tokenInfo,
    });
  }
);
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Logout successfull",
      data: null,
    });
  }
);
const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user as JwtPayload;

    // console.log(newPassword, oldPassword, decodedToken)
    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Password reset successfull",
      data: null,
    });
  }
);
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const {newPassword, id} = req.body;
    const decodedToken = req.user as JwtPayload;
    
    // console.log(newPassword, oldPassword, decodedToken)
    await AuthServices.resetPassword(newPassword, id, decodedToken);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Password reset successfull",
      data: null,
    });
  }
);
const setPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { password } = req.body;
    const decodedToken = req.user as JwtPayload;

    // console.log(newPassword, oldPassword, decodedToken)
    await AuthServices.setPassword(decodedToken.userId, password);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Password reset successfull",
      data: null,
    });
  }
);
const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { email } = req.body;
    await AuthServices.forgotPassword(email);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Email send successfull",
      data: null,
    });
  }
);

const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";
    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }
    const user = req.user;
    console.log("User", user);
    if (!user) throw new AppError("User not found", 401);
    const tokenInfo = createUserToken(user);

    setAuthCookie(res, tokenInfo);

    //redirect from backend
    res.redirect(`${envVar.FRONTEND_URL}/${redirectTo}`);
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  changePassword,
  resetPassword,
  setPassword,
  forgotPassword,
  googleCallbackController,
};
