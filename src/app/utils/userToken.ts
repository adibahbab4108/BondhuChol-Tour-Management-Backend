import { envVar } from "../config/env.config";
import AppError from "../errorHelpers/AppError";
import { isActive, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";

export const createUserToken = (user: Partial<IUser>) => {
  const payloadForToken = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    payloadForToken,
    envVar.JWT_ACCESS_SECRET,
    envVar.JWT_ACCESS_EXPIRES_IN
  );

  const refreshToken = generateToken(
    payloadForToken,
    envVar.JWT_REFRESH_SECRET,
    envVar.JWT_REFRESH_EXPIRES_IN
  );

  return {
    accessToken,
    refreshToken,
  };
};
export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVar.JWT_REFRESH_SECRET
  );

  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

  if (!isUserExist) {
    throw new AppError("User does not exist", 404);
  }
  if (
    isUserExist.isActive === isActive.BLOCKED ||
    isUserExist.isActive === isActive.INACTIVE
  ) {
    throw new AppError(`User is ${isUserExist.isActive}`, 404);
  }
  if (isUserExist.isDeleted) {
    throw new AppError("User is deleted", 404);
  }

  const payloadForToken = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    payloadForToken,
    envVar.JWT_ACCESS_SECRET,
    envVar.JWT_ACCESS_EXPIRES_IN
  );
  return accessToken;
};
