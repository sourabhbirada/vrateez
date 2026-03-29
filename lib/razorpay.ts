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

export async function openRazorpayCheckout(options: RazorpayOptions): Promise<void> {
  await loadRazorpayScript();

  return new Promise((resolve, reject) => {
    const razorpay = new window.Razorpay({
      ...options,
      handler: (response) => {
        options.handler(response);
        resolve();
      },
      modal: {
        ...options.modal,
        ondismiss: () => {
          options.modal?.ondismiss?.();
          reject(new Error("Payment cancelled by user"));
        },
      },
    });

    razorpay.open();
  });
}

// Mock payment for testing when Razorpay is not configured
export function mockPayment(orderId: string): Promise<RazorpayResponse> {
  return new Promise((resolve) => {
    // Simulate payment delay
    setTimeout(() => {
      resolve({
        razorpay_payment_id: `pay_mock_${Date.now()}`,
        razorpay_order_id: orderId,
        razorpay_signature: `sig_mock_${Date.now()}`,
      });
    }, 1500);
  });
}
