import { model, Schema } from "mongoose";
import { isActive, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  { _id: false, versionKey: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false }, // Password should not be returned in queries
    phone: { type: String, unique: true, sparse: true }, // Sparse allows for unique phone numbers while allowing some users to not have a phone number
    picture: { type: String, default: "" },
    address: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(isActive),
      default: isActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    auths: [authProviderSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export const User = model<IUser>("User", userSchema);
