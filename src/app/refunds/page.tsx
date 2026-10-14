import type { Metadata } from "next";
import Link from "next/link";
import { LegalHeading, LegalPage, LegalPoints } from "@/components/ui/LegalPage";
import { buildPageMetadata } from "@/lib/seo";
import {
  DAMAGE_CLAIM_DAYS,
  FREE_CANCELLATION_HOURS,
  MAX_CANCELLATION_CHARGE,
  POLICY_UPDATED,
  REFUND_TIMELINE,
  SUPPORT_EMAIL,
  SUPPORT_HOURS,
  SUPPORT_PHONE_DISPLAY,
} from "@/lib/policies";

export const metadata: Metadata = buildPageMetadata({
  title: "Refund & Return Policy",
  description: `Virtue Gems accepts returns for products that arrive damaged, reported within ${DAMAGE_CLAIM_DAYS} days of delivery. How to report damage, what evidence to share, and how claims are resolved.`,
  path: "/refunds",
  keywords: ["jewellery return policy", "damaged jewellery return", "Virtue Gems refunds"],
});

const linkClass = "font-semibold text-gold-dark underline";

export default function RefundsPage() {
  return (
    <LegalPage title="Refund & Return Policy" lastUpdated={POLICY_UPDATED.refunds}>
      <p>
        This policy explains what to do if your Virtue Gems order arrives damaged, and how
        cancellations and refunds work. Nothing in this policy limits any right or remedy you have
        under the Consumer Protection Act, 2019 or any other law that cannot be excluded.
      </p>

      <LegalHeading>Returns We Accept</LegalHeading>
      <LegalPoints
        items={[
          <>
            Under our standard policy, we accept returns only for products that{" "}
            <strong>arrive damaged</strong>.
          </>,
          <>
            Please report the damage <strong>within {DAMAGE_CLAIM_DAYS} days of delivery</strong>.
            The {DAMAGE_CLAIM_DAYS}-day period begins on the date you receive your order.
          </>,
          "If you receive the wrong product, or an item is missing from your parcel, please contact us within the same period and we will handle it in the same way as a damaged-product claim.",
          "We do not accept returns or exchanges for change of mind, or for damage caused after delivery through use, wear or improper care.",
        ]}
      />

      <LegalHeading>How to Report Damage</LegalHeading>
      <p>
        Please contact us as soon as possible — ideally on the day your parcel arrives — and no
        later than {DAMAGE_CLAIM_DAYS} days after delivery.
      </p>
      <LegalPoints
        items={[
          <>
            WhatsApp: <strong>{SUPPORT_PHONE_DISPLAY}</strong>
          </>,
          <>
            Email: <strong>{SUPPORT_EMAIL}</strong>
          </>,
          "Share your order ID (or the name and phone number used for the order) and a short description of the damage.",
        ]}
      />

      <LegalHeading>Evidence We Ask For</LegalHeading>
      <LegalPoints
        items={[
          <>
            <strong>An unboxing video</strong> — a continuous video of the parcel being opened,
            showing the sealed package, the shipping label and the condition of the product as it
            is taken out.
          </>,
          <>
            <strong>Clear photographs</strong> of the damaged product, the packaging and the
            shipping label.
          </>,
          <>
            <strong>Your order details</strong>, so we can match the claim to your order.
          </>,
        ]}
      />
      <p>
        We recommend recording an unboxing video every time you open a Virtue Gems parcel — it is
        the quickest way for us to approve a claim.
      </p>
      <p>
        <strong>No unboxing video?</strong> You can still make a claim. Send photos of the product,
        packaging and shipping label, and any other details you have (for example, a note from the
        delivery person). We will assess your claim on the evidence available and will not reject a
        genuine claim only because an unboxing video is not available.
      </p>

      <LegalHeading>How Claims Are Reviewed and Resolved</LegalHeading>
      <LegalPoints
        items={[
          "We acknowledge your claim on WhatsApp or email, usually the same day during support hours.",
          "We review the video, photos and order details. If we need more information, we will ask you for it.",
          "We then tell you whether the claim is approved and, if it is, how it will be resolved.",
          <>
            <strong>Approved claims:</strong> we replace the product with the same item if it is in
            stock. If the same item is not available, we offer you another product of the same
            value.
          </>,
          "If neither a replacement nor an alternative product of the same value is available or suitable, please tell us — this policy does not take away any refund or other remedy you are entitled to by law.",
        ]}
      />

      <LegalHeading>Return Shipping</LegalHeading>
      <LegalPoints
        items={[
          "We will tell you whether the damaged product needs to be sent back to us.",
          "If it does, we will arrange the return or reimburse the return shipping cost. You will not be charged for returning a product under an approved damage claim.",
          "We do not charge a delivery fee for sending a replacement or alternative product for an approved claim.",
        ]}
      />

      <LegalHeading>Order Cancellation</LegalHeading>
      <LegalPoints
        items={[
          <>
            You can cancel free of charge <strong>within {FREE_CANCELLATION_HOURS} hours</strong>{" "}
            of placing your order, as long as it has not been dispatched. If you have already paid,
            we refund the full amount.
          </>,
          `After ${FREE_CANCELLATION_HOURS} hours, but before dispatch, a cancellation charge of up to ${MAX_CANCELLATION_CHARGE} of the order value may apply. We will tell you the exact amount on WhatsApp before the cancellation is processed, and refund the balance.`,
          "Orders cannot be cancelled once dispatched. If a dispatched order arrives damaged, the damage policy above applies.",
          "If we cancel your order — for example, because an item is out of stock — we refund everything you have paid in full.",
        ]}
      />

      <LegalHeading>Refunds</LegalHeading>
      <LegalPoints
        items={[
          "Refunds apply to cancelled orders that were already paid, orders we are unable to fulfil, and any other case where a refund is required by law.",
          "Refunds are paid by UPI or bank transfer.",
          `We send the refund within ${REFUND_TIMELINE} from the date it is approved. Your bank or UPI app may take a little longer to show the amount.`,
        ]}
      />

      <LegalHeading>Exchanges</LegalHeading>
      <p>We do not currently offer exchanges for size or change of mind.</p>

      <LegalHeading>Contact</LegalHeading>
      <LegalPoints
        items={[
          <>
            WhatsApp: <strong>{SUPPORT_PHONE_DISPLAY}</strong>
          </>,
          <>
            Email: <strong>{SUPPORT_EMAIL}</strong>
          </>,
          `Support hours: ${SUPPORT_HOURS}`,
          <>
            See also our{" "}
            <Link href="/shipping" className={linkClass}>
              Shipping &amp; Delivery Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className={linkClass}>
              Terms &amp; Conditions
            </Link>
            .
          </>,
        ]}
      />
    </LegalPage>
  );
}
