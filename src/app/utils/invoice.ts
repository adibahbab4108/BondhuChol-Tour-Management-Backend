/* eslint-disable no-console */
import PDFDocument from "pdfkit";
import AppError from "../errorHelpers/AppError";

export interface IInvoiceData {
  treansactionId: string;
  bookingDate: Date;
  userName: string;
  tourTitle: string;
  guestCount: number;
  totalAmount: number;
}

export const generatePdf = async (
  invoiceData: IInvoiceData
): Promise<Buffer<ArrayBufferLike>> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffer: Uint8Array[] = [];
      doc.on("data", (chunk) => buffer.push(chunk));
      doc.on("end", () => {
        resolve(Buffer.concat(buffer));
      });
      doc.on("error", (err) =>
        reject(new AppError("PDF generation failed", 500, err.message))
      );
      doc.fontSize(20).text("Invoice", { align: "center" });
      doc.moveDown();
      doc.fontSize(14).text(`Transaction ID: ${invoiceData.treansactionId}`);
      doc.text(`Booking Date: ${invoiceData.bookingDate.toLocaleDateString()}`);
      doc.text(`Customer: ${invoiceData.userName}`);

      doc.moveDown();
      doc.text(`Tour: ${invoiceData.tourTitle}`);
      doc.text(`Guest: ${invoiceData.guestCount}`);
      doc.text(`Total Amount: ${invoiceData.totalAmount.toFixed(2)} BDT`);
      doc.text("Thank you for being with us!", { align: "center" });
      doc.end();
    });
  } catch (error: any) {
    console.error("Error generating PDF:", error);
    throw new AppError("Failed to generate PDF", 401);
  }
};
