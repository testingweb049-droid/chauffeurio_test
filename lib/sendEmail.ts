import nodemailer from "nodemailer";
import { sanitizeHtml } from "./utils"; // Create this utility function

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async ({ to, subject, html }: EmailParams) => {
  try {
    // Validate email address format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      throw new Error(`Invalid email format: ${to}`);
    }

    // Sanitize HTML to prevent XSS attacks (implement sanitizeHtml utility)
    const sanitizedHtml = sanitizeHtml(html);

    // Create transport with TLS
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.hostinger.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: false, // True for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || "info@oktaxis.co.uk",
        pass: process.env.EMAIL_PASSWORD || ";U3nJxy=hs",
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: process.env.NODE_ENV === "production",
      },
    });

    const mailOptions = {
      from: {
        name: "OkTaxis",
        address: process.env.EMAIL_USER || "info@oktaxis.co.uk",
      },
      to,
      subject,
      html: sanitizedHtml,
      headers: {
        "X-Priority": "1", // Highest priority
        "X-MSMail-Priority": "High",
        Importance: "High",
      },
    };

    // Debug logging if in development
    if (process.env.NODE_ENV !== "production") {
      console.log("Mail Options:", {
        ...mailOptions,
        html: mailOptions.html.substring(0, 100) + "...", // Truncate for logging
      });
    }

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV !== "production") {
      console.log(`Email sent to ${to}, Message ID: ${info.messageId}`);
    }

    return info;
  } catch (error) {
    console.error("Error sending email:", error);

    // Log more details in non-production
    if (process.env.NODE_ENV !== "production") {
      console.error("Error details:", error);
    }

    throw new Error(`Email sending failed: ${(error as Error).message}`);
  }
};

export default sendEmail;
