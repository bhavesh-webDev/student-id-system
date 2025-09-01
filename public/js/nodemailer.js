import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.HOST_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export const sendEmail = async (email, subject, headMessage, mainMessage) => {
  try {
    const info = await transporter.sendMail({
      from: "student id system <studentidsystem6@gmail.com>",
      to: email,
      subject: subject,
      text: headMessage, // plain‑text body
      html: `<b>${mainMessage}</b>`,
    });
    console.log("Mail Sent Successfully..", info.messageId);
  } catch (error) {
    console.log({
      message: "Error in send mail function...",
      error: error.stack,
    });
  }
};

transporter.verify((error, success) => {
  if (error) {
    console.log("Error in nodemailer : ", error);
  }
  console.log("Connected to SMTP Sucessfully : ", success);
});
