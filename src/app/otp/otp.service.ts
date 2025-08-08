import crypto from "crypto";
import { redisClient } from "../config/redis.config";
import { sendEmail } from "../utils/sendEmail";
import AppError from "../errorHelpers/AppError";
import { User } from "../modules/user/user.model";
const OTP_EXPIRATION = 2 * 60; //2 minute

const generateOtp = (length = 6) => {
  //6 digit otp
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  return otp;
};
export const sendOTP = async (email: string, name: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isVerified) {
    throw new AppError("User already verified", 400);
  }
  const otp = generateOtp();

  const redisKey = `otp:${email}`;
  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION,
    },
  });

  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    templateName: "otp",
    templateData: {
      name: name,
      otp: otp,
    },
  });
};
export const verifyOTP = async (email: string, otp: string) => {
  // const user = await User.findOne({ email, isVerified: false });
  const user = await User.findOne({ email});
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (user.isVerified) {
    throw new AppError("User already verified", 400);
  }

  if (!otp) {
    throw new AppError("OTP is required", 400);
  }

  const redisKey = `otp:${email}`;
  const storedOtp = await redisClient.get(redisKey);

  if (!storedOtp) {
    throw new AppError("OTP has expired or does not exist.", 401);
  }
  if (storedOtp !== otp) {
    throw new AppError("Invalid OTP.", 401);
  }

  await Promise.all([
    User.updateOne({ email }, { isVerified: true }),
    redisClient.del([redisKey]),
  ]);
};
export const OTPService = {
  sendOTP,
  verifyOTP,
};
