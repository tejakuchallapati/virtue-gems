export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: "orders" | "delivery" | "products" | "rewards" | "returns";
};

export const FAQ_CATEGORIES: Record<FaqItem["category"], string> = {
  orders: "Orders & Payment",
  delivery: "Delivery",
  products: "Products & Quality",
  rewards: "Rewards & Points",
  returns: "Returns & Refunds",
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "how-to-order",
    category: "orders",
    question: "How do I place an order?",
    answer:
      "Browse our shop, add items to your cart, and proceed to checkout. Fill in your delivery details and tap Place Order via WhatsApp — we confirm availability and guide you through payment on WhatsApp.",
  },
  {
    id: "payment-methods",
    category: "orders",
    question: "What payment methods do you accept?",
    answer:
      "We accept UPI (GPay, PhonePe, Paytm) and bank transfer on WhatsApp after your order is confirmed. Online payment on the website is coming soon — for now, we keep payment simple and personal on WhatsApp.",
  },
  {
    id: "order-confirmation",
    category: "orders",
    question: "When will I receive order confirmation?",
    answer:
      "After you message us on WhatsApp from checkout, our team confirms your order within 2–4 hours during business hours. You will receive your order ID and invoice link.",
  },
  {
    id: "payment-screenshot",
    category: "orders",
    question: "Why do I need to send a payment screenshot?",
    answer:
      "After you pay via UPI or bank transfer, send the payment screenshot on WhatsApp so we can verify and dispatch your order quickly.",
  },
  {
    id: "cod-policy",
    category: "orders",
    question: "Do you offer Cash on Delivery (COD)?",
    answer:
      "We currently do not offer cash on delivery. Pay via UPI or bank transfer on WhatsApp after we confirm your order. COD may be added for select areas in the future.",
  },
  {
    id: "delivery-regions",
    category: "delivery",
    question: "Where do you deliver?",
    answer:
      "We currently deliver only to Andhra Pradesh and Telangana. We are expanding to more regions as we scale production.",
  },
  {
    id: "delivery-time",
    category: "delivery",
    question: "How long does delivery take?",
    answer:
      "Delivery typically takes 3–7 business days within Andhra Pradesh and Telangana, depending on your location and product availability.",
  },
  {
    id: "shipping-cost",
    category: "delivery",
    question: "Is delivery free?",
    answer:
      "Yes, we offer free delivery across Andhra Pradesh and Telangana on all orders.",
  },
  {
    id: "product-quality",
    category: "products",
    question: "Are your jewellery pieces hallmarked?",
    answer:
      "Yes. Our gold and silver pieces come with proper hallmark certification. Product specifications are listed on each product page.",
  },
  {
    id: "virtual-try-on",
    category: "products",
    question: "Can I try jewellery on before buying?",
    answer:
      "Yes! Use our Virtual Try-On feature on any product page — upload a selfie and see how necklaces, earrings, rings, and more look on you.",
  },
  {
    id: "out-of-stock",
    category: "products",
    question: "What if a product is out of stock?",
    answer:
      "Message us on WhatsApp with the product name. We can notify you when it is back in stock or suggest similar pieces from our collection.",
  },
  {
    id: "loyalty-points",
    category: "rewards",
    question: "How do Virtue Gems Rewards points work?",
    answer:
      "You earn points on every order placed through checkout. Visit the Rewards page to check your balance and redeem discounts or free jewellery items.",
  },
  {
    id: "redeem-rewards",
    category: "rewards",
    question: "How do I redeem rewards at checkout?",
    answer:
      "Go to Rewards, enter your phone number, and select a reward to activate. The discount applies automatically when you checkout with the same phone number.",
  },
  {
    id: "return-policy",
    category: "returns",
    question: "Can I return or exchange a product?",
    answer:
      "Returns are accepted within 7 days for unused items in original packaging. Custom or engraved pieces cannot be returned. See our Refund & Return Policy for full details.",
  },
  {
    id: "unboxing-video",
    category: "returns",
    question: "Why is an unboxing video required for returns?",
    answer:
      "A continuous unboxing video recorded while opening the parcel is mandatory for any return or refund — including damaged items. Without it, we cannot process your request.",
  },
  {
    id: "damaged-product",
    category: "returns",
    question: "What if my product arrives damaged?",
    answer:
      "Contact us on WhatsApp within 48 hours with your order details, photos, and the mandatory unboxing video. We will arrange a replacement or full refund if approved.",
  },
];
