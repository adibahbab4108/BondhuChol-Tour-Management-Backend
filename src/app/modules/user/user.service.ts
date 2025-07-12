// this file used for database interaction and business logic related to user management
// The service's job is to abstract business logic,
// it is used by user controller to handle user related requests

import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { name, email } = payload;

  const user = await User.create({
    name,
    email,
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
