import nodemailer from "nodemailer";
import { ConfigKeys } from "../config.js";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ConfigKeys.Email,
    pass: ConfigKeys.Mail_password,
  },
});


export const sendEmail = async (email, subject, message) => {
  const mailOptions = {
    from: ConfigKeys.Email,
    to: email,
    subject,
    html: message,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
    throw new Error("Failed to send email");
  }
};


export const generateEmailTemplate = (title, description, buttonText, link) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 10px; background-color: #ffffff; border: 1px solid #ddd; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #333; text-align: center;">${title}</h2>
    <p style="font-size: 16px; color: #555; text-align: center;">${description}</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${link}" target="_blank" style="text-decoration: none; background-color: #007BFF; color: #fff; padding: 12px 24px; border-radius: 5px; font-size: 18px; font-weight: bold; display: inline-block;">
        ${buttonText}
      </a>
    </div>
    <p style="font-size: 14px; color: #999; text-align: center;">
      If you didn’t request this, please ignore this email.
    </p>
  </div>
`;



export const sendVerificationEmail = async (email, verificationLink) => {
  const subject = "Verify Your Email Address";
  const message = generateEmailTemplate(
    "Verify Your Email",
    "Thank you for signing up! Click the button below to verify your email address.",
    "Verify Email",
    verificationLink
  );
  await sendEmail(email, subject, message);
};



export const sendPasswordResetEmail = async (email, resetLink) => {
  const subject = "Reset Your Password";
  const message = generateEmailTemplate(
    "Reset Your Password",
    "It looks like you requested a password reset. Click the button below to set a new password.",
    "Reset Password",
    resetLink
  );
  await sendEmail(email, subject, message);
};
