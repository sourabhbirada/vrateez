export type ProductCategory = "cookie" | "energy-bar" | "desert-date";

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface AuthUser {
  _id?: string;
  id: string;
  name: string;
  email: string;
  role?: "customer" | "admin";
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  discount: string;
  weight: string;
  description: string;
  benefits: string[];
  ingredients: string;
  nutritionHighlights: string[];
  stock: number;
  isActive: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
}

export interface Order {
  _id: string;
  user?: string;
  guestInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    product: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }>;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  paymentMethod: "card" | "upi" | "netbanking" | "cod" | "razorpay";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: "placed" | "processing" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  couponCode?: string;
  discountAmount: number;
  shippingCharge: number;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GuestInfo {
  name: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

export interface PaymentIntent {
  payment: {
    _id: string;
    paymentId: string;
    razorpayOrderId?: string;
    amount: number;
    currency: string;
    status: "created" | "success" | "failed";
  };
  // Stripe fields
  clientSecret?: string;
  stripePublishableKey?: string;
  // Razorpay fields
  razorpayOrderId?: string;
  razorpayKeyId?: string;
  // Common fields
  amount: number;
  currency: string;
  provider: "stripe" | "razorpay" | "mock";
  providers?: {
    stripe: boolean;
    razorpay: boolean;
    mock: boolean;
  };
}
