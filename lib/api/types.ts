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
  user: string;
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
  paymentMethod: "card" | "upi" | "netbanking" | "cod";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: "placed" | "processing" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  discountAmount: number;
  shippingCharge: number;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
