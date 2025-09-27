import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";
import { envVar } from "../../config/env.config";
import { sendResponse } from "../../utils/sendResponse";
import { SSLService } from "../sslCommerz/sslCommerz.service";

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;

  const result = await PaymentService.initPayment(bookingId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment Initiated Successfully",
    data: result,
  });
});
const successPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.successPayment(
    query as Record<string, string>
  );
  if (result?.success) {
    res.redirect(
      `${envVar.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});
const failPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.failPayment(
    query as Record<string, string>
  );
  if (!result.success) {
    res.redirect(
      `${envVar.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});
const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.cancelPayment(
    query as Record<string, string>
  );
  if (result?.success) {
    res.redirect(
      `${envVar.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

const getInvoiceDownloadUrl = catchAsync(
  async (req: Request, res: Response) => {
    const { paymentId } = req.params;
    const result = await PaymentService.getInvoiceDownloadUrl(paymentId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Invoice download URL retrieved successfully",
      data: result,
    });
  }
);

const validatePayment = catchAsync(
  async (req: Request, res: Response) => {
    
    console.log("sslcommerz ipn ulr body", req.body)
    await SSLService.validatePayment(req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Payment successfully successfully",
      data: null,
    });
  }
);

export const PaymentController = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
  getInvoiceDownloadUrl,
  validatePayment
};
