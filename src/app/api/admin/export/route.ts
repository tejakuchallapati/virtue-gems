import { getCurrentAdmin } from "@/lib/admin-auth";
import { apiFail } from "@/lib/api-server";
import { getOrdersSafe } from "@/lib/orders";
import { listProductsSafe } from "@/lib/product-store-server";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import {
  listAdminProfiles,
  listReminders,
  listSupabaseCustomers,
} from "@/lib/supabase/store";

function csvCell(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function csvResponse(name: string, rows: unknown[][]) {
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  return new Response(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return apiFail("Unauthorized.", 401);

  const type = new URL(request.url).searchParams.get("type") || "orders";
  const date = new Date().toISOString().slice(0, 10);

  try {
    if (type === "orders") {
      const orders = await getOrdersSafe();
      return csvResponse(`virtue-gems-orders-${date}.csv`, [
        [
          "Order ID",
          "Date",
          "Customer",
          "Phone",
          "City",
          "State",
          "Pincode",
          "Items",
          "Total",
          "Status",
        ],
        ...orders.map((order) => [
          order.id,
          order.createdAt,
          order.customerName,
          order.phone,
          order.city,
          order.state,
          order.pincode,
          order.items
            .map((item) => `${item.name} x ${item.quantity}`)
            .join("; "),
          order.total,
          order.status,
        ]),
      ]);
    }

    if (type === "products") {
      const products = await listProductsSafe({ includeInactive: true });
      return csvResponse(`virtue-gems-products-${date}.csv`, [
        [
          "ID",
          "Name",
          "Slug",
          "Category",
          "Price",
          "Stock",
          "Active",
          "Images",
        ],
        ...products.map((product) => [
          product.id,
          product.name,
          product.slug,
          product.category,
          product.price,
          product.stock,
          product.active !== false,
          product.images.join("; "),
        ]),
      ]);
    }

    if (type === "customers") {
      if (!isSupabaseAdminConfigured()) {
        return apiFail("Connect Supabase to export CRM customers.", 503);
      }
      const customers = await listSupabaseCustomers();
      return csvResponse(`virtue-gems-customers-${date}.csv`, [
        [
          "Name",
          "Phone",
          "Email",
          "City",
          "State",
          "Pincode",
          "Orders",
          "Total Spent",
          "Last Order",
        ],
        ...customers.map((customer) => [
          customer.name,
          customer.phone,
          customer.email,
          customer.city,
          customer.state,
          customer.pincode,
          customer.totalOrders,
          customer.totalSpent,
          customer.lastOrderAt,
        ]),
      ]);
    }

    if (type === "backup") {
      if (admin.role !== "owner" && admin.role !== "admin") {
        return apiFail("Only owners and admins can download backups.", 403);
      }
      const [orders, products, customers, reminders, admins] =
        await Promise.all([
          getOrdersSafe(),
          listProductsSafe({ includeInactive: true }),
          isSupabaseAdminConfigured()
            ? listSupabaseCustomers()
            : Promise.resolve([]),
          isSupabaseAdminConfigured() ? listReminders() : Promise.resolve([]),
          isSupabaseAdminConfigured()
            ? listAdminProfiles()
            : Promise.resolve([]),
        ]);
      return Response.json(
        {
          exportedAt: new Date().toISOString(),
          schemaVersion: 1,
          orders,
          products,
          customers,
          reminders,
          admins,
        },
        {
          headers: {
            "Content-Disposition": `attachment; filename="virtue-gems-backup-${date}.json"`,
            "Cache-Control": "no-store",
          },
        },
      );
    }

    return apiFail("Unknown export type.", 400);
  } catch (error) {
    console.error("Admin export error:", error);
    return apiFail("Failed to prepare export.", 500);
  }
}
