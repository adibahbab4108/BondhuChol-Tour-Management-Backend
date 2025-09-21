/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import passport, { Profile } from "passport";
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVar } from "./env.config";
import { User } from "../modules/user/user.model";
import { isActive, Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email }).select("+password");

        if (!isUserExist) {
          return done(null, false, { message: "User not found" });
        }

        if (!isUserExist.isVerified) {
          // throw new AppError("User is not verified", 404);
          return done(`User is not verified`);
        }
        if (
          isUserExist.isActive === isActive.BLOCKED ||
          isUserExist.isActive === isActive.INACTIVE
        ) {
          // throw new AppError(`User is ${isUserExist.isActive}`, 404);
          return done(`User is ${isUserExist.isActive}`);
        }
        if (isUserExist.isDeleted) {
          // throw new AppError("User is deleted", 404);
          return done(`User is deleted`);
        }

        const isGoogleAuthenticated = isUserExist.auths.some(
          (providerObjects) => providerObjects.provider === "google"
        );

        if (isGoogleAuthenticated && !isUserExist.password) {
          return done(null, false, {
            message:
              "You have authenticated through google. If you want to login with credential, then at first login with google and set a password for your gmail and then you can login with email and password.",
          });
        }

        const isPasswordMatched = await bcrypt.compare(
          password as string,
          isUserExist.password as string
        );

        if (!isPasswordMatched) {
          return done(null, false, { message: "Password is incorrect" });
        }

        return done(null, isUserExist);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);
// passport.use(new Strategy({handle google login}, async()=>{handle database}))
passport.use(
  new GoogleStrategy(
    {
      clientID: envVar.GOOGLE_CLIENT_ID,
      clientSecret: envVar.GOOGLE_CLIENT_SECRET,
      callbackURL: envVar.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: "no email found" });
        }

        let isUserExist = await User.findOne({ email });

        if (isUserExist && !isUserExist.isVerified) {
          // throw new AppError("User is not verified", 404);
          return done(`User is not verified`);
        }
        if (
          isUserExist &&
          (isUserExist.isActive === isActive.BLOCKED ||
            isUserExist.isActive === isActive.INACTIVE)
        ) {
          // throw new AppError(`User is ${isUserExist.isActive}`, 404);
          return done(`User is ${isUserExist.isActive}`);
        }
        if (isUserExist && isUserExist.isDeleted) {
          // throw new AppError("User is deleted", 404);
          return done(`User is deleted`);
        }

        if (!isUserExist) {
          isUserExist = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }
        return done(null, isUserExist, { message: "user created successfull" });
      } catch (error) {
        console.log(error);
        return done(null, false, { message: "error creating user" });
      }
    }
  )
);
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  return done(null, user._id);
});
passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (error) {
    console.log(error);
    return done(error);
  }
});

//Bridge == Google->store user to db -> token
