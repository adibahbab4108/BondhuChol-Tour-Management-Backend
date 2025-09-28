import { Router } from "express";
import UserRoutes from "../modules/user/user.route";
import AuthRoutes from "../modules/auth/auth.route";
import DivisionRoutes from "../modules/division/division.route";
import TourRoutes from "../modules/tour/tour.route";
import BookingRoutes from "../modules/booking/booking.route";
import PaymentRoutes from "../modules/payment/payment.route";
import OtpRoutes from "../otp/otp.routes";
import StatsRoutes from "../modules/stats/stats.route";

export const router = Router();
const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/division",
    route: DivisionRoutes,
  },
{
    path: "/tour",
    route: TourRoutes,
  },
  {
    path: "/booking",
    route: BookingRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/otp",
    route: OtpRoutes,
  },
  {
    path: "/stats",
    route: StatsRoutes,
  },
];
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
// app.use("/api/v1/user", userRoutes);
// app.use("/api/v1/auth", AuthRoutes);
