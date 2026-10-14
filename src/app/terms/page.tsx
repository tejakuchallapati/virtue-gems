import type { Metadata } from "next";
import Link from "next/link";
import { LegalHeading, LegalPage, LegalPoints } from "@/components/ui/LegalPage";
import { buildPageMetadata } from "@/lib/seo";
import { DELIVERY_REGION_LABEL } from "@/lib/delivery";
import { COD_POLICY, PAYMENT_METHODS_SUMMARY } from "@/lib/payments";
import {
  DAMAGE_CLAIM_DAYS,
  FREE_CANCELLATION_HOURS,
  POLICY_UPDATED,
  SUPPORT_EMAIL,
  SUPPORT_HOURS,
  SUPPORT_PHONE_DISPLAY,
} from "@/lib/policies";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms & Conditions",
  description:
    "Terms for shopping at Virtue Gems — how WhatsApp ordering works, when an order is confirmed, payment, delivery, cancellation and returns.",
  path: "/terms",
});

const linkClass = "font-semibold text-gold-dark underline";

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" lastUpdated={POLICY_UPDATED.terms}>
      <p>
        These terms apply when you use the Virtue Gems website (www.virtuegems.com) and when you
        order from us. Please read them before placing an order. Nothing in these terms limits any
        right you have under the Consumer Protection Act, 2019 or any other law that cannot be
        excluded.
      </p>

      <LegalHeading>About Us</LegalHeading>
      <p>
        Virtue Gems sells fashion jewellery online, with ordering and customer support on
        WhatsApp. You can reach us on WhatsApp at <strong>{SUPPORT_PHONE_DISPLAY}</strong> or by
        email at <strong>{SUPPORT_EMAIL}</strong> ({SUPPORT_HOURS}).
      </p>

      <LegalHeading>Products</LegalHeading>
      <LegalPoints
        items={[
          "Our products are fashion jewellery. They are not made of real gold or real silver unless a product page clearly says so.",
          "We try to show every product accurately. Colours and finish can look slightly different because of lighting and screen settings.",
          "All products are subject to availability. We confirm availability on WhatsApp before you pay.",
        ]}
      />

      <LegalHeading>Prices</LegalHeading>
      <LegalPoints
        items={[
          "Prices are shown in Indian Rupees (INR).",
          "Delivery charges are not included in the product price. They depend on your delivery address.",
          "Before you pay, we confirm on WhatsApp the product price, the delivery charge and the total amount payable.",
          "If a price on the website is wrong because of an obvious error, we will tell you before you pay. You can then choose to continue at the correct price or cancel.",
        ]}
      />

      <LegalHeading>How Ordering Works</LegalHeading>
      <LegalPoints
        items={[
          <>
            <strong>1. Order request:</strong> you add products to your cart and check out on the
            website. WhatsApp opens with your order details. Sending this message is an order
            request — it is not yet a confirmed order.
          </>,
          <>
            <strong>2. Confirmation:</strong> we reply on WhatsApp to confirm availability, the
            delivery charge for your address and the total amount payable.
          </>,
          <>
            <strong>3. Payment:</strong> you pay the confirmed total and send us the payment
            screenshot on WhatsApp.
          </>,
          <>
            <strong>4. Confirmed order:</strong> your order is confirmed once we verify your
            payment and tell you so on WhatsApp. We then pack and dispatch it.
          </>,
        ]}
      />

      <LegalHeading>Payment</LegalHeading>
      <LegalPoints
        items={[
          `We accept ${PAYMENT_METHODS_SUMMARY}`,
          "No card or online payment is taken on the website.",
          COD_POLICY,
          "We will never ask for your card number, PIN or OTP.",
        ]}
      />

      <LegalHeading>Delivery</LegalHeading>
      <LegalPoints
        items={[
          `We currently deliver only to ${DELIVERY_REGION_LABEL}.`,
          <>
            Dispatch and delivery timelines, tracking, delays and failed deliveries are explained in
            our{" "}
            <Link href="/shipping" className={linkClass}>
              Shipping &amp; Delivery Policy
            </Link>
            .
          </>,
          "Please give a complete and correct delivery address and phone number.",
        ]}
      />

      <LegalHeading>Cancellation</LegalHeading>
      <LegalPoints
        items={[
          `You can cancel free of charge within ${FREE_CANCELLATION_HOURS} hours of placing your order, as long as it has not been dispatched. Any amount already paid is refunded in full.`,
          `After ${FREE_CANCELLATION_HOURS} hours, but before dispatch, we deduct only costs we have actually incurred for your order (for example, a courier booking already made). We tell you the amount and what it covers before the cancellation is processed, and refund the balance.`,
          "Orders cannot be cancelled once dispatched.",
          "If we cancel your order, we refund everything you have paid in full.",
        ]}
      />

      <LegalHeading>Returns, Replacements and Refunds</LegalHeading>
      <p>
        We accept returns for products that arrive damaged, reported within {DAMAGE_CLAIM_DAYS}{" "}
        days of delivery. Approved claims are resolved with the same item, another product of the
        same value, or — if neither is available — a refund for that product. We do not offer
        exchanges or returns for change of mind. The full process
        — including what evidence to share and how refunds are paid — is in our{" "}
        <Link href="/refunds" className={linkClass}>
          Refund &amp; Return Policy
        </Link>
        .
      </p>

      <LegalHeading>Reviews</LegalHeading>
      <LegalPoints
        items={[
          "Reviews must be honest and based on your own experience with Virtue Gems.",
          "We check reviews before publishing them. We publish the name and city you enter, your rating, comment and any photos you upload.",
          "We may decline reviews that are abusive, unrelated to our products or contain personal information.",
        ]}
      />

      <LegalHeading>Use of This Website</LegalHeading>
      <LegalPoints
        items={[
          "Website content, photos, designs and branding belong to Virtue Gems or are used with permission.",
          "You may not copy or reuse our content for commercial purposes without our written permission.",
          "Please do not misuse the website, including attempting to access areas or data you are not authorised to access.",
        ]}
      />

      <LegalHeading>Our Responsibility</LegalHeading>
      <LegalPoints
        items={[
          "We are responsible for delivering the products you order as described, and for handling claims as set out in our policies.",
          "To the extent the law allows, we are not responsible for indirect losses that were not foreseeable when you placed your order.",
          "Nothing in these terms excludes or limits our responsibility where the law does not allow it, including your rights under the Consumer Protection Act, 2019.",
        ]}
      />

      <LegalHeading>Complaints and Disputes</LegalHeading>
      <LegalPoints
        items={[
          <>
            If you have a complaint, please contact us first on WhatsApp or by email, or see the
            grievance details on our{" "}
            <Link href="/contact#grievances" className={linkClass}>
              Contact page
            </Link>
            .
          </>,
          "These terms are governed by the laws of India. Courts in Hyderabad, Telangana have jurisdiction, without affecting your right to approach a consumer commission under the Consumer Protection Act, 2019.",
        ]}
      />

      <LegalHeading>Changes to These Terms</LegalHeading>
      <p>
        We may update these terms from time to time. The terms that apply to your order are the
        ones published on this page when you place it. The date of the latest update is shown at
        the top of this page.
      </p>
    </LegalPage>
  );
}
