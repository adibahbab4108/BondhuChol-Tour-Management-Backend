// this file used for database interaction and business logic related to user management
// The service's job is to abstract business logic,
// it is used by user controller to handle user related requests

import AppError from "../../errorHelpers/AppError";
import { IAuth, IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExists = await User.findOne({ email });
  if (isUserExists) {
    throw new AppError("User already exists with this email", 400);
  }

  let hashedPassword;
  if (password) hashedPassword = await bcrypt.hash(password as string, 10);

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

export const userService = {
  createUser,
  getAllUsers,
};
