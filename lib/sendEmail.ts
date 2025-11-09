import nodemailer from "nodemailer";
import { sanitizeHtml } from "./utils"; 
import { emailConfig } from "./emailConfig";

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async ({ to, subject, html }: EmailParams) => {

  try {
    // Validate email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) throw new Error(`Invalid email format: ${to}`);

    // Sanitize HTML
    const sanitizedHtml = sanitizeHtml(html);

    console.log("emailConfig " ,emailConfig)

    // Create transporter
    const transporter = nodemailer.createTransport(emailConfig);
    
    
    // Mail options
    const mailOptions = {
      from: `"Chauffeurio" <info@chauffeurio.com>`,
      to,
      subject,
      html: sanitizedHtml,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}, Message ID: ${info.messageId}`);
    return info;

  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Email sending failed: ${(error as Error).message}`);
  }
};

export default sendEmail;
