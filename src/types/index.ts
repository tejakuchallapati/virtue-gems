export type ProductTag = "bestseller" | "new" | "trending";

export type ProductCategory =
  | "rings"
  | "necklaces"
  | "earrings"
  | "bracelets"
  | "pendants";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: ProductCategory;
  tags: ProductTag[];
  specifications: Record<string, string>;
  stock: number;
  rating: number;
  reviewCount: number;
  reviews: Review[];
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: { productId: string; name: string; quantity: number; price: number }[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  statusHistory?: OrderStatusEvent[];
};

export type AdminRole = "owner" | "admin" | "staff";

export type AdminProfile = {
  id: string;
  email: string;
  displayName?: string;
  role: AdminRole;
  active: boolean;
};

export type Customer = {
  id: string;
  phone: string;
  name: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: string;
  createdAt: string;
};

export type CustomerNote = {
  id: string;
  customerId: string;
  note: string;
  createdBy?: string;
  createdAt: string;
};

export type FollowUpReminder = {
  id: string;
  customerId?: string;
  orderId?: string;
  title: string;
  details?: string;
  dueAt: string;
  completedAt?: string;
  assignedTo?: string;
  createdAt: string;
};

export type OrderStatusEvent = {
  id: string;
  orderId: string;
  fromStatus?: OrderStatus;
  toStatus: OrderStatus;
  note?: string;
  changedBy?: string;
  createdAt: string;
};

export type CheckoutForm = {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export type LoyaltyRewardType = "percent_off" | "free_item";

export type LoyaltyReward = {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  type: LoyaltyRewardType;
  percentOff?: number;
  freeItemLabel?: string;
  maxDiscount?: number;
};

export type ActiveRedemption = {
  rewardId: string;
  title: string;
  type: LoyaltyRewardType;
  percentOff?: number;
  freeItemLabel?: string;
  maxDiscount?: number;
  pointsCost: number;
};

export type LoyaltyHistoryEntry = {
  type: "earn" | "redeem";
  points: number;
  label: string;
  date: string;
};

export type LoyaltyAccount = {
  phone: string;
  name?: string;
  points: number;
  lifetimePoints: number;
  history: LoyaltyHistoryEntry[];
};
