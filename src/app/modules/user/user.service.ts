// this file used for database interaction and business logic related to user management
// The service's job is to abstract business logic,
// it is used by user controller to handle user related requests

import { JwtPayload } from "jsonwebtoken";
import { envVar } from "../../config/env.config";
import AppError from "../../errorHelpers/AppError";
import { IAuth, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  
  const isUserExists = await User.findOne({ email });

  if (isUserExists) {
    throw new AppError("User already exists with this email", 400);
  }

  let hashedPassword;
  if (password)
    hashedPassword = await bcrypt.hash(
      password as string,
      Number(envVar.BCRYPT_SALT_ROUNDS)
    );

  const authProvider: IAuth = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  if (!user) {
    throw new Error("User creation failed");
  }

  return user;
};
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  /* 
      email (cannot update), name,phone, password (re-hasing), address
      only admin,superadmin- role, isDeleted
 */
  const isUserExists = await User.findById(userId);

  if (!isUserExists) throw new AppError("User not found", 404);

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError("You are not authorized to update role", 401);
    }
    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError("Your are not authorized to assign SUPER_ADMIN", 401);
    }
  }

  if (payload.email) {
    throw new AppError("Email update is not allowed", 400);
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError("You are not authorized to update user status", 401);
    }
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      envVar.BCRYPT_SALT_ROUNDS
    );
  }

  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdateUser;
};

const getAllUsers = async () => {
  const users = await User.find({});

  if (users.length === 0) {
    throw new Error("No users found");
  }
  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};
const getSingleUser = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("No users found");
  }

  return {
    data: user,
  };
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId);

  return { data: user };
};

export const userService = {
  createUser,
  updateUser,
  getAllUsers,
  getSingleUser,
  getMe,
};
