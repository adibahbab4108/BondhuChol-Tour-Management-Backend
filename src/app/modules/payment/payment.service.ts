/* eslint-disable no-console */
import AppError from "../../errorHelpers/AppError";
import { generatePdf, IInvoiceData } from "../../utils/invoice";
import { sendEmail } from "../../utils/sendEmail";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });
  console.log(payment);
  if (!payment)
    throw new AppError(
      "Payment Not Found. You have not booked this tour.",
      404
    );

  const booking = await Booking.findById(payment.booking);

  const userAddress = (booking?.user as any).address;
  const userEmail = (booking?.user as any).email;
  const userPhoneNumber = (booking?.user as any).phone;
  const userName = (booking?.user as any).name;

  const sslPayload: ISSLCommerz = {
    address: userAddress,
    email: userEmail,
    phoneNumber: userPhoneNumber,
    name: userName,
    amount: payment.amount,
    transactionId: payment.transactionId,
  };

  const sslPayment = await SSLService.sslPaymentInit(sslPayload);

  return {
    paymentUrl: sslPayment.GatewayPageURL,
  };
};
const successPayment = async (query: Record<string, string>) => {
  //update booking (confirm)
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      {
        transactionId: query.transactionId,
      },
      { status: PAYMENT_STATUS.PAID },
      {
        runValidators: true,
        session: session,
      }
    );
    if (!updatedPayment) {
      throw new AppError("Payment not found", 404);
    }

    const updateBooking = await Booking.findByIdAndUpdate(
      { _id: updatedPayment?.booking },
      {
        status: BOOKING_STATUS.COMPLETE,
      },
      {
        new: true,
        runValidators: true,
        session: session,
      }
    )
      .populate("tour", "title")
      .populate("user", "name email");
    if (!updateBooking) {
      throw new AppError("Booking not found", 404);
    }

    const invoiceData: IInvoiceData = {
      bookingDate: updateBooking.createdAt as Date,
      guestCount: updateBooking.guestCount,
      totalAmount: updatedPayment.amount,
      tourTitle: (updateBooking.tour as unknown as ITour).title,
      treansactionId: updatedPayment.transactionId,
      userName: (updateBooking.user as unknown as IUser).name,
    };

    const pdfBuffer = await generatePdf(invoiceData);

    await sendEmail({
      to: (updateBooking.user as unknown as IUser).email,
      subject: "Your Booking Invoice",
      templateName: "invoice",
      templateData:invoiceData,
      attachments: [
        {
          filename: `invoice-${invoiceData.treansactionId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    })


    await session.commitTransaction();
    session.endSession();
    return {
      success: true,
      message: "Payment successful",
    };
  } catch (error) {
    console.log(error);
    session.abortTransaction();
  }
};
const failPayment = async (query: Record<string, string>) => {
  //update booking (failed)
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      {
        transactionId: query.transactionId,
      },
      { status: PAYMENT_STATUS.FAILED },
      {
        runValidators: true,
        session: session,
      }
    );

    await Booking.findByIdAndUpdate(
      { _id: updatedPayment?.booking },
      {
        status: BOOKING_STATUS.FAILED,
      },
      {
        runValidators: true,
        session: session,
      }
    );

    await session.commitTransaction();
    session.endSession();
    return {
      success: false,
      message: "Payment failed",
    };
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const cancelPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      {
        transactionId: query.transactionId,
      },
      { status: PAYMENT_STATUS.CANCELED },
      {
        runValidators: true,
        session: session,
      }
    );

    await Booking.findByIdAndUpdate(
      { _id: updatedPayment?.booking },
      {
        status: BOOKING_STATUS.CANCEL,
      },
      {
        runValidators: true,
        session: session,
      }
    );

    await session.commitTransaction();
    session.endSession();
    return {
      success: true,
      message: "Payment canceled",
    };
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
};
