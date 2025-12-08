interface ApplePaySession {
    canMakePayments(): boolean;
    supportsVersion(version: number): boolean;
    new (version: number, paymentRequest: ApplePayPaymentRequest): ApplePaySession;
  }
  
  interface ApplePayPaymentRequest {
    countryCode: string;
    currencyCode: string;
    supportedNetworks: string[];
    merchantCapabilities: string[];
    total: {
      label: string;
      amount: string;
    };
  }
  
  interface GooglePaymentsClient {
    isReadyToPay(request: any): Promise<any>;
    loadPaymentData(request: any): Promise<any>;
  }
  
  interface GooglePayments {
    api: {
      PaymentsClient: new (options: any) => GooglePaymentsClient;
    };
  }
  
  interface PaymentRequest {
    new (methodData: any[], details: any): PaymentRequest;
  }
  
  declare global {
    interface Window {
      RevolutCheckout: any;
      ApplePaySession?: ApplePaySession;
      google?: {
        payments: GooglePayments;
      };
      PaymentRequest?: PaymentRequest;
    }
  }
  
  export {};