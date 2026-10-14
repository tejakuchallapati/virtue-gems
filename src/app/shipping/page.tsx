import type { Metadata } from "next";
import Link from "next/link";
import { LegalHeading, LegalPage, LegalPoints } from "@/components/ui/LegalPage";
import { buildPageMetadata } from "@/lib/seo";
import {
  DELIVERY_CHARGES_NOTICE,
  DELIVERY_REGION_LABEL,
  DELIVERY_TIMELINE,
  DISPATCH_TIMELINE,
} from "@/lib/delivery";
import {
  POLICY_UPDATED,
  SUPPORT_EMAIL,
  SUPPORT_HOURS,
  SUPPORT_PHONE_DISPLAY,
} from "@/lib/policies";

export const metadata: Metadata = buildPageMetadata({
  title: "Shipping & Delivery Policy",
  description:
    "Where Virtue Gems delivers, how delivery charges are confirmed, dispatch and delivery timelines, tracking, delays and failed deliveries.",
  path: "/shipping",
  keywords: ["jewellery delivery Andhra Pradesh", "jewellery delivery Telangana", "Virtue Gems shipping"],
});

const linkClass = "font-semibold text-gold-dark underline";

export default function ShippingPage() {
  return (
    <LegalPage title="Shipping & Delivery Policy" lastUpdated={POLICY_UPDATED.shipping}>
      <p>
        This page explains where we deliver, what delivery costs, and how long it usually takes.
      </p>

      <LegalHeading>Where We Deliver</LegalHeading>
      <LegalPoints
        items={[
          `We currently deliver only to addresses in ${DELIVERY_REGION_LABEL}.`,
          "We cannot accept orders for delivery outside these two states at the moment.",
        ]}
      />

      <LegalHeading>Delivery Charges</LegalHeading>
      <LegalPoints
        items={[
          "Delivery charges depend on your delivery address.",
          DELIVERY_CHARGES_NOTICE,
          "Before you pay, we tell you on WhatsApp the product price, the delivery charge and the total amount payable.",
        ]}
      />

      <LegalHeading>Dispatch and Delivery Times</LegalHeading>
      <LegalPoints
        items={[
          `We dispatch your order within ${DISPATCH_TIMELINE}.`,
          `Delivery is ${DELIVERY_TIMELINE}, depending on your location.`,
          "The delivery estimate begins on the day your order is dispatched. Business days are Monday to Saturday, excluding public holidays.",
          "These are estimates, not guaranteed delivery dates.",
        ]}
      />

      <LegalHeading>Tracking</LegalHeading>
      <p>
        When the courier provides tracking details, we share them with you on WhatsApp after
        dispatch. If tracking is not available for your shipment, you can message us for an update
        at any time.
      </p>

      <LegalHeading>Delivery Delays</LegalHeading>
      <LegalPoints
        items={[
          "Delays can happen because of courier issues, weather, holidays or other events outside our control.",
          "If your order has not arrived within the expected time, contact us and we will follow up with the courier and keep you updated on WhatsApp.",
        ]}
      />

      <LegalHeading>Failed Delivery or Incorrect Address</LegalHeading>
      <LegalPoints
        items={[
          "Please check that your name, phone number, address and pincode are complete and correct before you confirm your order.",
          "If you notice a mistake, tell us on WhatsApp as soon as possible. We can update the address if the order has not been dispatched.",
          "If a parcel cannot be delivered — for example because the address is incorrect or incomplete, or the recipient cannot be reached — we will contact you to arrange re-delivery.",
          "If re-delivery needs a new delivery charge, we will tell you the amount before we re-send the parcel.",
        ]}
      />

      <LegalHeading>Damaged on Arrival</LegalHeading>
      <p>
        If your order arrives damaged, please see our{" "}
        <Link href="/refunds" className={linkClass}>
          Refund &amp; Return Policy
        </Link>{" "}
        for how to report it.
      </p>

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
        ]}
      />
    </LegalPage>
  );
}
