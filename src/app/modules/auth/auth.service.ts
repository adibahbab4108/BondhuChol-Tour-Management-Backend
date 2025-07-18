import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import {
  createNewAccessTokenWithRefreshToken,
} from "../../utils/userToken";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import { envVar } from "../../config/env.config";

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

const resetPassword = async (
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
  user!.password = await bcrypt.hash(newPassword, Number(envVar.BCRYPT_SALT_ROUNDS));
  user!.save()
};

export const AuthServices = {
  // credentialsLogin,
  getNewAccessToken,
  resetPassword
};
