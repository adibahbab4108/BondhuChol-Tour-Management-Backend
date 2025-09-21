/* eslint-disable no-unused-vars */
import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
}

export interface IAuth {
  provider: "google" | "credentials";
  providerId: string;
}

export enum isActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}

export interface IUser {
  _id?:Types.ObjectId
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: boolean;
  isActive?: isActive;
  isVerified?: boolean;

  auths: IAuth[];
  role: Role;
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
