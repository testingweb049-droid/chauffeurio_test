import nodemailer from "nodemailer";
import { sanitizeHtml } from "./utils"; 

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async ({ to, subject, html }: EmailParams) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASSWORD;
  const emailHost = process.env.EMAIL_HOST;
  const emailPort = parseInt(process.env.EMAIL_PORT || "465");

  if (!emailUser || !emailPass || !emailHost) {
    throw new Error("EMAIL_USER, EMAIL_PASSWORD, or EMAIL_HOST environment variable is not set");
  }

  try {
    // Validate email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) throw new Error(`Invalid email format: ${to}`);

    // Sanitize HTML
    const sanitizedHtml = sanitizeHtml(html);

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: 587,
      secure: false,      // STARTTLS
      auth: { user: emailUser, pass: emailPass },
    });
    

    // Mail options
    const mailOptions = {
      from: `"Chauffeurio" <${emailUser}>`,
      to,
      subject,
      html: sanitizedHtml,
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "High",
      },
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
