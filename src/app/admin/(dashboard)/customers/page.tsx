import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getOrdersSafe } from "@/lib/orders";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import {
  listCustomerNotes,
  listReminders,
  listSupabaseCustomers,
} from "@/lib/supabase/store";
import { CustomerCrm } from "@/components/admin/CustomerCrm";
import type { Customer } from "@/types";

export default async function CustomersPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const orders = await getOrdersSafe();
  const configured = isSupabaseAdminConfigured();
  const [customers, reminders] = configured
    ? await Promise.all([listSupabaseCustomers(), listReminders()])
    : [deriveCustomers(orders), []];
  const initialNotes =
    configured && customers[0]
      ? await listCustomerNotes(customers[0].id)
      : [];

  return (
    <CustomerCrm
      initialCustomers={customers}
      initialOrders={orders}
      initialReminders={reminders}
      initialNotes={initialNotes}
      setupRequired={!configured}
    />
  );
}

function deriveCustomers(orders: Awaited<ReturnType<typeof getOrdersSafe>>) {
  const byPhone = new Map<string, Customer>();
  for (const order of [...orders].reverse()) {
    const existing = byPhone.get(order.phone);
    byPhone.set(order.phone, {
      id: order.phone,
      phone: order.phone,
      name: order.customerName,
      address: order.address,
      city: order.city,
      state: order.state,
      pincode: order.pincode,
      totalOrders: (existing?.totalOrders ?? 0) + 1,
      totalSpent: (existing?.totalSpent ?? 0) + order.total,
      lastOrderAt: order.createdAt,
      createdAt: existing?.createdAt ?? order.createdAt,
    });
  }
  return [...byPhone.values()].sort(
    (a, b) =>
      new Date(b.lastOrderAt ?? 0).getTime() -
      new Date(a.lastOrderAt ?? 0).getTime(),
  );
}
