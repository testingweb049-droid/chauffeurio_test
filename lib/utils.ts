import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Step:1 Add User's Form Data here to Send Booking email...
export const sendBookingEmail = async (values: any) => {
  try {
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        passengerInfo: values.passengerInfo,
        bookingDetails: {
          pickUpAddress: values.pickUpAddress,
          dropOffAddress: values.dropOffAddress,
          date: values.date,
          time: values.time,
          bookingType: values.bookingType,
          flightNumber: values.flightNumber,
          vehicleTitle: values.selectedVehicle,
          vehicleType: values.vehicleType,
          category: values.category,
          passengerCount: values.passengerCount,
          bagCount: values.bagCount,
          childCount: values.childCount,
          textarea: values.textarea,
          stops: values.stops,
          hourly: values.hourlyCharter,
          distance: parseFloat(values.distance).toFixed(2),
          price: values.totalPrice,
        },
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      console.error("Failed to send emails. Server response:", errorMessage);
      throw new Error(errorMessage.message || "Unknown server error");
    }

    console.log("Emails sent successfully");
  } catch (error) {
    console.error("Error sending emails:", error.message);
    throw error;
  }
};

// Get Data for Register Driver...
export const registerDriverEmail = async (values: any) => {
  try {
    const response = await fetch("/api/registerDriver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        phone: values.phone,
        vehicleType: values.vehicleType,
        preferredContact: values.preferredContact,
        carMake: values.carMake,
        carModel: values.carModel,
        licenseNumber: values.licenseNumber,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      console.error("Failed to send emails. Server response:", errorMessage);
      throw new Error(errorMessage.message || "Unknown server error");
    }

    console.log("Emails sent successfully");
  } catch (error: any) {
    console.error("Error sending emails:", error.message);
    throw error;
  }
};


export const contactEmail = async (values: any) => {
  try {
    const response = await fetch("/api/contactEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: values.message,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      console.error("Failed to send emails. Server response:", errorMessage);
      throw new Error(errorMessage.message || "Unknown server error");
    }

    console.log("Emails sent successfully");
  } catch (error) {
    console.error("Error sending emails:", error.message);
    throw error;
  }
};

/**
 * Sanitizes HTML content to prevent XSS attacks.
 * This is a basic implementation - consider using a library like DOMPurify in production.
 */
export function sanitizeHtml(html: string): string {
  // Replace script tags
  let sanitized = html.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );

  // Replace inline event handlers
  sanitized = sanitized.replace(/on\w+="[^"]*"/g, "");
  sanitized = sanitized.replace(/on\w+='[^']*'/g, "");

  // Replace iframe tags
  sanitized = sanitized.replace(
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    ""
  );

  // Replace data: and javascript: URLs
  sanitized = sanitized.replace(/data:[^"']*['"]/gi, '""');
  sanitized = sanitized.replace(/javascript:[^"']*['"]/gi, '""');

  return sanitized;
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Logs safely - avoids logging sensitive data in production
 */
export function safeLog(message: string, data: any, isSensitive = false): void {
  if (process.env.NODE_ENV !== "production" || !isSensitive) {
    if (typeof data === "object" && data !== null) {
      console.log(message, JSON.stringify(data, null, 2));
    } else {
      console.log(message, data);
    }
  } else {
    console.log(message, "[REDACTED]");
  }
}
