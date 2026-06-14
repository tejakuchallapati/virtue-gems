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

export type OrderStatus = "pending" | "processing" | "completed";

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
