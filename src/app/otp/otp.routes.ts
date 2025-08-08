import { Router } from "express";
import { OTPController } from "./otp.controller";

const OtpRoutes = Router();

OtpRoutes.post("/send", OTPController.sendOTP);
OtpRoutes.post("/verify", OTPController.verifyOTP);
export default OtpRoutes;
