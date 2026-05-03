declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  method?: {
    card?: boolean;
    upi?: boolean;
    netbanking?: boolean;
    wallet?: boolean;
    paylater?: boolean;
    emi?: boolean;
  };
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

/** User closed the Razorpay checkout without completing payment */
export class PaymentCancelledError extends Error {
  readonly name = 'PaymentCancelledError';

  constructor() {
    super('Payment cancelled');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function isPaymentCancelledError(err: unknown): err is PaymentCancelledError {
  return err instanceof PaymentCancelledError;
}

let razorpayScriptLoaded = false;
let razorpayScriptLoading: Promise<void> | null = null;

export function loadRazorpayScript(): Promise<void> {
  if (razorpayScriptLoaded) {
    return Promise.resolve();
  }

  if (razorpayScriptLoading) {
    return razorpayScriptLoading;
  }

  razorpayScriptLoading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      razorpayScriptLoaded = true;
      resolve();
    };

    script.onerror = () => {
      razorpayScriptLoading = null;
      reject(new Error("Failed to load Razorpay script"));
    };

    document.body.appendChild(script);
  });

  return razorpayScriptLoading;
}

export async function openRazorpayCheckout(options: RazorpayOptions): Promise<RazorpayResponse> {
  await loadRazorpayScript();

  return new Promise((resolve, reject) => {
    const razorpay = new window.Razorpay({
      ...options,
      handler: (response) => {
        options.handler(response);
        resolve(response);
      },
      modal: {
        ...options.modal,
        ondismiss: () => {
          options.modal?.ondismiss?.();
          reject(new PaymentCancelledError());
        },
      },
    });

    razorpay.open();
  });
}
