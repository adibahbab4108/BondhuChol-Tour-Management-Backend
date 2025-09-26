/* eslint-disable no-console */
import { envVar } from "../../config/env.config";
import AppError from "../../errorHelpers/AppError";
import { Payment } from "../payment/payment.model";
import { ISSLCommerz } from "./sslCommerz.interface";
import axios from "axios";
const sslPaymentInit = async (payload: ISSLCommerz) => {
  try {
    const data = {
      store_id: envVar.SSL_STORE_ID,
      store_passwd: envVar.SSL_STORE_PASS,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transactionId,
      success_url: `${envVar.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
      fail_url: `${envVar.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
      cancel_url: `${envVar.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
      ipn_url:envVar.SSL_IPN_URL,
      shipping_method: "N/A",
      product_name: "Tour",
      product_category: "service",
      product_profile: "general",
      cus_name: payload.name,
      cus_email: payload.email,
      cus_add1: payload.address,
      cus_add2: "N/A",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: payload.phoneNumber,
      cus_fax: "N/A",
      cus_note: "N/A",
    };

    const response = await axios({
      method: "POST",
      url: envVar.SSL_PAYMENT_API,
      data: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data;
  } catch (error) {
    console.error("Error occured", error);
    throw new AppError("Error occured in payment", 400);
  }
};

const validatePayment = async (payload: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${envVar.SSL_VALIDATION_API}?val_id=${payload.val_id}&store_id=${envVar.SSL_STORE_ID}&store_passwd=${envVar.SSL_STORE_PASS}`,
    });

    console.log("SSLCommerz validate api response",response);

    await Payment.updateOne(
      { transactionId: payload.tran_id },
      { paymentGatewayData: response.data },
      { runValidators: true }
    );
  } catch (error: any) {
    console.log(error);
    throw new AppError(`Payment Validation Error, ${error?.message}`, 401);
  }
};
export const SSLService = {
  sslPaymentInit,
  validatePayment,
};
