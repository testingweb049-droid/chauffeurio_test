"use server";

import { Client, Environment } from "square";
import { randomUUID } from "crypto";

console.log('Environment ',Environment)
const squareClient = new Client({
  accessToken: "EAAAl0j-ptaxRP-CjeWgOkd091xw8Fh2hPMnKvwsXuBAF6ygarJT5tEE9k-xHPWn",
  environment: "sandbox", // Change to .Production when going live
});

const paymentsApi = squareClient.paymentsApi;

// Function to process Square payments
export async function processSquarePayment({
  sourceId,
  amount,
}: {
  sourceId: string;
  amount: number;
}) {
  try {
    const response = await paymentsApi.createPayment({
      idempotencyKey: randomUUID(),
      sourceId,
      amountMoney: {
        amount: amount * 100, // Convert to cents
        currency: "GBP",
      },
    });

    return { success: true, paymentId: response.result.payment?.id };
  } catch (error) {
    console.error("Square Payment Error:", error);
    return { success: false, error: "Payment failed" };
  }
}
