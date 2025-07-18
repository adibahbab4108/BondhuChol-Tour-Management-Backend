/* eslint-disable no-console */
import { envVar } from "../config/env.config";
import { IAuth, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";
export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExists = await User.findOne({
      email: envVar.SUPER_ADMIN_EMAIL,
    });
    if (isSuperAdminExists) {
      console.log("Super Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      envVar.SUPER_ADMIN_PASSWORD, Number(envVar.BCRYPT_SALT_ROUNDS) || 10
    );
    const authProvider:IAuth = {
      provider: "credentials",
      providerId: envVar.SUPER_ADMIN_EMAIL,
    };

    const payload:IUser ={
        name: "Super Admin",
        email: envVar.SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        role: Role.SUPER_ADMIN,
        isVerified: true,
        auths: [authProvider],
    }
    const superAdmin = await User.create(payload);

    console.log("SuperAdmin created:\n",superAdmin)
  } catch (error) {
    console.error("Error seeding super admin:", error);
  }
};
