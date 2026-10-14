import { DELIVERY_TIMELINE, DISPATCH_TIMELINE } from "@/lib/delivery";
import {
  DAMAGE_CLAIM_DAYS,
  FREE_CANCELLATION_HOURS,
  MAX_CANCELLATION_CHARGE,
  REFUND_TIMELINE,
  SUPPORT_HOURS_SHORT,
} from "@/lib/policies";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: "orders" | "delivery" | "products" | "returns";
};

export const FAQ_CATEGORIES: Record<FaqItem["category"], string> = {
  orders: "Orders & Payment",
  delivery: "Delivery",
  products: "Products & Care",
  returns: "Returns, Cancellations & Refunds",
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "how-to-order",
    category: "orders",
    question: "How do I place an order?",
    answer:
      "Add the pieces you like to your cart and check out on the website. WhatsApp then opens with your order details — send that message to us. We reply to confirm availability, the delivery charge for your address and the total amount. You pay by UPI or bank transfer, send us the payment screenshot, and we dispatch your order.",
  },
  {
    id: "order-confirmation",
    category: "orders",
    question: "When is my order confirmed?",
    answer: `Sending the WhatsApp message from checkout is an order request. We reply on WhatsApp — usually the same day during support hours (${SUPPORT_HOURS_SHORT}) — to confirm availability and the total amount payable. Your order is confirmed once we verify your payment and tell you so on WhatsApp.`,
  },
  {
    id: "payment-methods",
    category: "orders",
    question: "What payment methods do you accept?",
    answer:
      "We accept UPI (GPay, PhonePe, Paytm) and bank transfer, after we confirm your order total on WhatsApp. There is no card or online payment on the website. We will never ask for your card number, PIN or OTP.",
  },
  {
    id: "payment-screenshot",
    category: "orders",
    question: "Why do I need to send a payment screenshot?",
    answer:
      "After you pay by UPI or bank transfer, the screenshot helps us match your payment to your order quickly so we can dispatch it.",
  },
  {
    id: "cod-policy",
    category: "orders",
    question: "Do you offer Cash on Delivery (COD)?",
    answer:
      "No, we do not currently offer cash on delivery. Please pay by UPI or bank transfer after we confirm your order.",
  },
  {
    id: "delivery-regions",
    category: "delivery",
    question: "Where do you deliver?",
    answer:
      "We currently deliver only to addresses in Andhra Pradesh and Telangana. We cannot accept orders for other states at the moment.",
  },
  {
    id: "shipping-cost",
    category: "delivery",
    question: "How much is delivery?",
    answer:
      "Delivery charges depend on your delivery address. Before you pay, we tell you on WhatsApp the product price, the delivery charge and the total amount payable.",
  },
  {
    id: "delivery-time",
    category: "delivery",
    question: "How long does delivery take?",
    answer: `We dispatch your order within ${DISPATCH_TIMELINE}. Delivery is then ${DELIVERY_TIMELINE}, depending on your location. These are estimates — if your order is delayed, message us and we will follow up with the courier.`,
  },
  {
    id: "order-tracking",
    category: "delivery",
    question: "Can I track my order?",
    answer:
      "When the courier provides tracking details, we share them with you on WhatsApp after dispatch. If tracking is not available for your shipment, message us any time for an update.",
  },
  {
    id: "product-material",
    category: "products",
    question: "What are your products made of?",
    answer:
      "Our products are fashion jewellery — they are not real gold or real silver. Where we have confirmed material and finish details for a piece, they are listed on its product page.",
  },
  {
    id: "product-care",
    category: "products",
    question: "How should I care for my jewellery?",
    answer:
      "Keep your jewellery away from water, perfume, lotions and sweat. Put it on after makeup and perfume, wipe it gently with a soft dry cloth after wearing, and store each piece separately in a dry pouch or box.",
  },
  {
    id: "out-of-stock",
    category: "products",
    question: "What if a product is out of stock?",
    answer:
      "Message us on WhatsApp with the product name. We can let you know if it comes back in stock or suggest similar pieces.",
  },
  {
    id: "return-policy",
    category: "returns",
    question: "Can I return a product?",
    answer: `Under our standard policy, we accept returns only for products that arrive damaged, reported within ${DAMAGE_CLAIM_DAYS} days of the date you receive your order. We do not accept returns or exchanges for change of mind. See our Refund & Return Policy for full details.`,
  },
  {
    id: "damaged-product",
    category: "returns",
    question: "My product arrived damaged. What should I do?",
    answer: `Contact us on WhatsApp or email as soon as possible, and within ${DAMAGE_CLAIM_DAYS} days of delivery. Share your order details, photos of the damaged product, packaging and shipping label, and your unboxing video if you have one. We review the claim and, if approved, replace the product with the same item, or offer another product of the same value if it is out of stock. You are not charged for returning a product under an approved claim.`,
  },
  {
    id: "unboxing-video",
    category: "returns",
    question: "Do I need an unboxing video?",
    answer:
      "We strongly recommend recording a continuous video while opening your parcel — it is the quickest way for us to approve a damage claim. If you do not have one, you can still make a claim with photos and any other evidence you have, and we will assess it fairly.",
  },
  {
    id: "cancel-order",
    category: "returns",
    question: "Can I cancel my order?",
    answer: `Yes — free of charge within ${FREE_CANCELLATION_HOURS} hours of placing your order, as long as it has not been dispatched. After ${FREE_CANCELLATION_HOURS} hours but before dispatch, a cancellation charge of up to ${MAX_CANCELLATION_CHARGE} of the order value may apply; we tell you the amount first. Orders cannot be cancelled once dispatched.`,
  },
  {
    id: "refund-method",
    category: "returns",
    question: "How and when are refunds paid?",
    answer: `Refunds are paid by UPI or bank transfer within ${REFUND_TIMELINE} from the date the refund is approved. Your bank or UPI app may take a little longer to show the amount.`,
  },
  {
    id: "exchanges",
    category: "returns",
    question: "Do you offer exchanges?",
    answer: "We do not currently offer exchanges for size or change of mind.",
  },
];
