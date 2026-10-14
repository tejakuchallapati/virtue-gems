import type { Metadata } from "next";
import { LegalHeading, LegalPage, LegalPoints } from "@/components/ui/LegalPage";
import { buildPageMetadata } from "@/lib/seo";
import {
  POLICY_UPDATED,
  SUPPORT_EMAIL,
  SUPPORT_HOURS,
  SUPPORT_PHONE_DISPLAY,
} from "@/lib/policies";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "What personal information Virtue Gems collects for orders, reviews and enquiries, why we use it, who we share it with, how long we keep it, and how to contact us about your data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated={POLICY_UPDATED.privacy}>
      <p>
        Virtue Gems (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) respects your privacy. This
        policy explains what personal information we collect when you use www.virtuegems.com or
        order from us, how we use it, and the choices you have.
      </p>

      <LegalHeading>Information We Collect</LegalHeading>
      <LegalPoints
        items={[
          <>
            <strong>When you place an order:</strong> your name, phone number, delivery address,
            city, state and pincode, and the products, quantities and prices in your order.
          </>,
          <>
            <strong>On WhatsApp:</strong> the messages you send us, including your order details and
            payment screenshots, and any photos or videos you share for a damage claim.
          </>,
          <>
            <strong>When you use the contact form:</strong> your name, email address, phone number
            (optional), topic and message.
          </>,
          <>
            <strong>When you write a review:</strong> the name and city you enter, your rating,
            comment and any photos you upload.
          </>,
          <>
            <strong>Technical information:</strong> our hosting provider automatically processes
            basic technical data such as your IP address, browser type and the pages requested, to
            deliver the website and keep it secure.
          </>,
        ]}
      />
      <p>We do not collect card details. Payments are made directly through UPI or bank transfer.</p>

      <LegalHeading>How We Use Your Information</LegalHeading>
      <LegalPoints
        items={[
          "To confirm, process, pack and deliver your order, and to send you order updates on WhatsApp",
          "To verify payments and handle cancellations, damage claims and refunds",
          "To reply to your enquiries and provide customer support",
          "To moderate and publish reviews you submit",
          "To keep the website secure and prevent misuse",
          "To meet our legal, tax and accounting obligations",
        ]}
      />
      <p>
        We only send promotional messages if you ask us to, and you can stop them at any time.
      </p>

      <LegalHeading>Who We Share It With</LegalHeading>
      <p>We do not sell your personal information. We share it only where needed:</p>
      <LegalPoints
        items={[
          <>
            <strong>Courier / delivery partners</strong> — your name, phone number and address, to
            deliver your order.
          </>,
          <>
            <strong>WhatsApp (Meta)</strong> — orders and support conversations take place on
            WhatsApp, under WhatsApp&apos;s own privacy policy.
          </>,
          <>
            <strong>Vercel</strong> — hosts this website.
          </>,
          <>
            <strong>Supabase</strong> — stores our order records, reviews and review photos.
          </>,
          <>
            <strong>Google (Gmail)</strong> — delivers contact-form messages to our inbox.
          </>,
          "Government authorities, where we are required to by law.",
        ]}
      />
      <p>
        Some of these providers may store or process data on servers outside India. We use them
        only to run our service.
      </p>

      <LegalHeading>Cookies and Browser Storage</LegalHeading>
      <LegalPoints
        items={[
          "We do not currently use analytics, advertising or tracking cookies.",
          "Your browser stores your cart, wishlist and recently viewed products on your own device so they are there when you return, and remembers whether you have seen our opening animation during a visit. You can clear this at any time by clearing your browser data.",
          "If we introduce analytics or similar tools in future, we will update this policy and ask for your consent where the law requires it.",
        ]}
      />

      <LegalHeading>How Long We Keep It</LegalHeading>
      <LegalPoints
        items={[
          "Order records are kept for as long as needed to fulfil your order, handle any claim, and meet legal, tax and accounting requirements.",
          "Contact-form messages and WhatsApp conversations are kept for as long as needed to answer your enquiry and provide follow-up support.",
          "Published reviews stay on the website until you ask us to remove them, or we remove them. When a review is deleted, its photos are deleted too.",
          "When we no longer need your information for these purposes, we delete it.",
        ]}
      />

      <LegalHeading>Keeping Your Information Safe</LegalHeading>
      <p>
        We take reasonable steps to protect your information, including limiting access to our
        team members who need it. No method of storing or sending data online is completely
        secure, so please contact us straight away if you think your information has been misused.
      </p>

      <LegalHeading>Your Choices and Rights</LegalHeading>
      <LegalPoints
        items={[
          "Ask what personal information we hold about you",
          "Ask us to correct or update inaccurate information",
          "Ask us to delete your information where we no longer need it for your order or by law",
          "Ask us to remove a review you submitted",
          "Stop promotional messages at any time",
          "Raise a complaint about how we handle your information",
        ]}
      />
      <p>
        To make a request or complaint, email <strong>{SUPPORT_EMAIL}</strong> or message us on
        WhatsApp at <strong>{SUPPORT_PHONE_DISPLAY}</strong> ({SUPPORT_HOURS}). We may need to
        confirm your identity before acting on a request. If you are not satisfied with our
        response, you may have the right to complain to the relevant authority under Indian law.
      </p>

      <LegalHeading>Children</LegalHeading>
      <p>
        Our website is meant for adults. If you are under 18, please use it and place orders with
        the involvement of a parent or guardian.
      </p>

      <LegalHeading>Updates to This Privacy Policy</LegalHeading>
      <p>
        Virtue Gems may update this Privacy Policy from time to time to reflect changes in our
        practices, services, or applicable laws. The latest version will be published on this
        page, along with the date of the most recent update.
      </p>
      <p>
        Where required by applicable law, we will provide notice of material changes and obtain any
        necessary consent. Changes will take effect from the date specified in the updated policy,
        subject to applicable legal requirements.
      </p>
      <p>
        We encourage you to review this page periodically to stay informed about how we handle your
        personal information.
      </p>
    </LegalPage>
  );
}
