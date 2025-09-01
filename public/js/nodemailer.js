import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";
configDotenv();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.HOST_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export const sendEmail = async (email, subject, headMessage, mainMessage) => {
  const info = await transporter.sendMail({
    from: "student id system <studentidsystem6@gmail.com>",
    to: email,
    subject: subject,
    text: headMessage, // plain‑text body
    html: `<b>${mainMessage}</b>`,
  });
  console.log("Mail Sent Successfully..");
};
