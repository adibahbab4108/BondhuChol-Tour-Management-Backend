import nodemailer from "nodemailer";
import { envVar } from "../config/env.config";
import path from "path";
import ejs from "ejs";
import AppError from "../errorHelpers/AppError";

const transporter = nodemailer.createTransport({
  host: envVar.SMTP_HOST,
  port: Number(envVar.SMTP_PORT),
  secure: Number(envVar.SMTP_PORT) === 465, // auto match
  auth: {
    user: envVar.SMTP_USER,
    pass: envVar.SMTP_PASS,
  }
});


interface sendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: sendEmailOptions) => {
  try {
    const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVar.SMTP_USER,
      to: to,
      subject: subject,
      text: "Hello world",
      html: html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });
    console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`)
  } catch (error:any) {
    console.error("Email sending error",error);
    throw new AppError("Email Error",401)
  }
};
