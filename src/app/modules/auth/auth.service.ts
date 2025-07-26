/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userToken";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { envVar } from "../../config/env.config";
import { IAuth, isActive } from "../user/user.interface";
import { sendEmail } from "../../utils/sendEmail";

//we handouver this to passport.js
// const credentialsLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;

//   const isUserExist = await User.findOne({ email }).select("+password");

//   if (!isUserExist) {
//     throw new AppError("User does not exist", 404);
//   }

//   if (!isUserExist.password) {
//     throw new AppError("Password is not set for this user", 400);
//   }

//   const isPasswordMatched = await bcrypt.compare(
//     password as string,
//     isUserExist.password as string
//   );

//   if (!isPasswordMatched) {
//     throw new AppError("Password is incorrect", 401);
//   }

//   // const payloadForToken = {
//   //   userId: isUserExist._id,
//   //   email: isUserExist.email,
//   //   role: isUserExist.role,
//   // };

//   // const accessToken = generateToken(
//   //   payloadForToken,
//   //   envVar.JWT_ACCESS_SECRET,
//   //   envVar.JWT_ACCESS_EXPIRES_IN
//   // );

//   // const refreshToken = generateToken(
//   //   payloadForToken,
//   //   envVar.JWT_REFRESH_SECRET,
//   //   envVar.JWT_REFRESH_EXPIRES_IN
//   // );

//   const userToken = createUserToken(isUserExist);

//   const userObject = isUserExist.toObject();
//   delete userObject.password;

//   return {
//     accessToken: userToken.accessToken,
//     refreshToken: userToken.refreshToken,
//     user: userObject,
//   };
// };

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );
  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId).select("+password");

  const isOldPasswordMatched = await bcrypt.compare(
    oldPassword,
    user!.password as string
  );

  if (!isOldPasswordMatched) {
    throw new AppError("Old password is incorrect", 401);
  }
  user!.password = await bcrypt.hash(
    newPassword,
    Number(envVar.BCRYPT_SALT_ROUNDS)
  );
  user!.save();
};
const resetPassword = async (
  newPassword: string,
  id: string,
  decodedToken: JwtPayload
) => {
  if (id !== decodedToken.userId) {
    throw new AppError("You cannot rest your password", 401);
  }

  const user = await User.findById(id).select("+password");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  user.password = await bcrypt.hash(
    newPassword,
    Number(envVar.BCRYPT_SALT_ROUNDS)
  );
  user.save();

};
const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.password && user.auths.some((auth) => auth.provider === "google")) {
    throw new AppError(
      "You have already set password. Now you can change the password from your profile",
      401
    );
  }

  const hashedPassword = await bcrypt.hash(
    plainPassword,
    Number(envVar.BCRYPT_SALT_ROUNDS)
  );

  const credentialProvider: IAuth = {
    provider: "credentials",
    providerId: user.email,
  };

  const auths: IAuth[] = [...user.auths, credentialProvider];
  user.password = hashedPassword;
  user.auths = auths;

  await user.save();
};
const forgotPassword = async (email: string) => {
  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError("User does not exist", 404);
  }
  if (
    isUserExist.isActive === isActive.BLOCKED ||
    isUserExist.isActive === isActive.INACTIVE
  ) {
    throw new AppError(`User is ${isUserExist.isActive}`, 404);
  }
  if (!isUserExist.isVerified) {
    throw new AppError("User is not verified", 404);
  }
  if (isUserExist.isDeleted) {
    throw new AppError("User is deleted", 404);
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const resetToken = jwt.sign(jwtPayload, envVar.JWT_ACCESS_SECRET, {
    expiresIn: "10m",
  });

  const resetUILink = `${envVar.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;

  sendEmail({
    to: isUserExist.email,
    subject: "Reset Password",
    templateName: "forgetPassword",
    templateData: {
      name: isUserExist.name,
      resetUILink,
    },
  });

  // http://localhost:5173/reset-password?id=6877f984cb9219a64393da51&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODc3Zjk4NGNiOTIxOWE2NDM5M2RhNTEiLCJlbWFpbCI6ImFkaWIuYWJjMjAyMkBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc1MzU1NjEyMywiZXhwIjoxNzUzNTU2NzIzfQ.WN2LE_CuCKIPppKXiXmjBFmnSYkCXIUxwmKzzKUECo0
};

export const AuthServices = {
  // credentialsLogin,
  getNewAccessToken,
  resetPassword,
  setPassword,
  forgotPassword,
  changePassword,
};
