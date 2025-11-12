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

    // Sanitize HTML
    const sanitizedHtml = sanitizeHtml(html);

    console.log("emailConfig " ,emailConfig)

    // Create transporter
    const transporter = nodemailer.createTransport(emailConfig);
    
    
    // Mail options
    const mailOptions = {
      from: `info@chauffeurio.com`,
      to:[to, 'info@chauffeurio.com'],
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
