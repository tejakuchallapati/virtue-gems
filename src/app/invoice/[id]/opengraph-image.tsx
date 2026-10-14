import { ImageResponse } from "next/og";
import { getOrderByIdSafe } from "@/lib/orders";
import { PRODUCTION_SITE_URL } from "@/lib/site";
import { formatDate, formatPrice } from "@/lib/utils";

export const alt = "Virtue Gems order invoice";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MAX_ITEMS = 4;
const INK = "#1a0a2e";
const GOLD = "#d4af37";

/**
 * WhatsApp shows this as the preview card when the invoice link is sent.
 * Invoice links are shareable, so the address and phone number are deliberately left out.
 */
export default async function InvoiceImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderByIdSafe(id);
  const items = order?.items ?? [];
  const extraItems = items.length - MAX_ITEMS;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#faf6ee",
          fontFamily: "sans-serif",
          color: INK,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: INK,
            padding: "30px 56px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={`${PRODUCTION_SITE_URL}/logo-vg.png`} width={184} height={72} alt="" />
            <div style={{ display: "flex", flexDirection: "column", marginLeft: 24 }}>
              <div style={{ display: "flex", fontSize: 34, fontWeight: 700, letterSpacing: 6, color: "#faf6ee" }}>
                VIRTUE GEMS
              </div>
              <div style={{ display: "flex", fontSize: 20, color: GOLD, marginTop: 4 }}>
                Premium fashion jewellery
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: GOLD, letterSpacing: 2 }}>
              ORDER INVOICE
            </div>
            <div style={{ display: "flex", fontSize: 20, color: "rgba(250,246,238,0.7)", marginTop: 4 }}>
              {order ? `${order.id} · ${formatDate(order.createdAt)}` : "Order not found"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, padding: "28px 56px 0" }}>
          {order && (
            <div style={{ display: "flex", fontSize: 24, color: "rgba(26,10,46,0.65)", marginBottom: 14 }}>
              Bill to: {order.customerName} · {order.city}
            </div>
          )}
          {items.slice(0, MAX_ITEMS).map((item, i) => (
            <div
              key={`${item.productId}-${i}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 28,
                padding: "12px 0",
                borderBottom: "2px solid rgba(26,10,46,0.1)",
              }}
            >
              <div style={{ display: "flex", maxWidth: 800 }}>
                {item.name} × {item.quantity}
              </div>
              <div style={{ display: "flex", fontWeight: 700 }}>
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
          {extraItems > 0 && (
            <div style={{ display: "flex", fontSize: 24, color: "rgba(26,10,46,0.6)", paddingTop: 10 }}>
              + {extraItems} more item{extraItems > 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 56px 30px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", fontSize: 22, color: "rgba(26,10,46,0.65)" }}>
            <div style={{ display: "flex" }}>Order request · Pending confirmation</div>
            <div style={{ display: "flex", marginTop: 4 }}>Delivery charge confirmed on WhatsApp</div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: GOLD,
              padding: "16px 28px",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            Total {order ? formatPrice(order.total) : "—"}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
