export type ProductCategory = string;

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  cookies: "Cookies",
  "infused-cookie": "Infused Cookies",
  "energy-on-the-go": "Energy on the Go",
  "savory-snacks": "Savory Snacks",
  "wholesome-delights": "Wholesome Delights",
};

const PRODUCT_CATEGORY_ALIASES: Record<string, ProductCategory> = {
  cookie: "cookies",
  "energy-bar": "energy-on-the-go",
  "desert-date": "infused-cookie",
};

export function normalizeProductCategory(category: string): ProductCategory | string {
  return PRODUCT_CATEGORY_ALIASES[category] ?? category;
}

export function getProductCategoryLabel(category: string): string {
  const normalized = normalizeProductCategory(category);
  return PRODUCT_CATEGORY_LABELS[normalized as ProductCategory] ?? category.replace(/-/g, " ");
}

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
  emailVerified?: boolean;
  phone?: string;
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
  amazonUrl?: string;
  packOptions?: Array<{
    units: number;
    label?: string;
    discountPercent: number;
  }>;
  customization?: {
    enabled: boolean;
    title?: string;
    options?: Array<{
      key: string;
      label: string;
      type: "select" | "text";
      required?: boolean;
      choices?: Array<{
        label: string;
        value: string;
        image?: string;
        priceDelta?: number;
      }>;
    }>;
  };
  freeDelivery?: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  productsCount?: number;
}

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  tag?: string;
  cta: string;
  ctaLink: string;
  image: string;
  video?: string;
  bgColor: string;
  macros?: Array<{ value: string; label: string }>;
  isActive: boolean;
  position: number;
}

export interface Deal {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  cta: string;
  ctaLink: string;
  image: string;
  video: string;
  price: number;
  originalPrice: number;
  items: string[];
  productSlug?: string;
  placement: "homepage" | "landing";
  bgFrom: string;
  bgTo: string;
  isActive: boolean;
  position: number;
}

export interface Testimonial {
  _id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  productName?: string;
  avatar?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface SiteSettings {
  _id: string;
  appearance: {
    brandColors: {
      primary: string;
      headerBg: string;
      footerBg: string;
      accent: string;
    };
    homepageSections: {
      heroCarousel: boolean;
      benefitsSection: boolean;
      newLaunches: boolean;
      ourProducts: boolean;
      testimonials: boolean;
      availableAtPartners: boolean;
      newsletterSignup: boolean;
    };
  };
  shipping: {
    freeShippingThreshold: number;
    standardShippingFee: number;
    deliveryDays: string;
    deliveryCoverage: string;
    paymentMethods: {
      upi: boolean;
      cards: boolean;
      netBanking: boolean;
      cod: boolean;
    };
  };
  contact: {
    supportEmail: string;
    phone: string;
    whatsapp: string;
    address: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
  socialMedia: {
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
  };
  announcementBar?: {
    enabled: boolean;
    text: string;
    link?: string;
    bgColor?: string;
    textColor?: string;
  };
  content?: {
    benefits?: Array<{
      title: string;
      subtitle: string;
      image: string;
      bgColor?: string;
    }>;
    partners?: Array<{
      name: string;
      url?: string;
      logoUrl?: string;
    }>;
    featureBadges?: string[];
  };
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
  contactPhone?: string;
  trackingNumber?: string;
  courierPartner?: string;
  estimatedDeliveryAt?: string;
  trackingEvents?: Array<{
    status: string;
    title: string;
    note?: string;
    location?: string;
    createdAt: string;
  }>;
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
