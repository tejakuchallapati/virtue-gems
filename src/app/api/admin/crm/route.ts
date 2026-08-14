import { getCurrentAdmin } from "@/lib/admin-auth";
import { apiFail, apiOk, parseJsonBody } from "@/lib/api-server";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import {
  addCustomerNote,
  addReminder,
  completeReminder,
  listCustomerNotes,
  listReminders,
  listSupabaseCustomers,
  listSupabaseOrders,
} from "@/lib/supabase/store";

export async function GET(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return apiFail("Unauthorized.", 401);
  if (!isSupabaseAdminConfigured()) {
    return apiOk({
      customers: [],
      reminders: [],
      notes: [],
      setupRequired: true,
    });
  }

  try {
    const customerId = new URL(request.url).searchParams.get("customerId");
    if (customerId) {
      return apiOk({ notes: await listCustomerNotes(customerId) });
    }
    const [customers, orders, reminders] = await Promise.all([
      listSupabaseCustomers(),
      listSupabaseOrders(),
      listReminders(),
    ]);
    return apiOk({ customers, orders, reminders, notes: [] });
  } catch (error) {
    console.error("CRM GET error:", error);
    return apiFail("Failed to load CRM data.", 500);
  }
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return apiFail("Unauthorized.", 401);
  if (!isSupabaseAdminConfigured()) {
    return apiFail("Connect Supabase to use CRM notes and reminders.", 503);
  }
  const parsed = await parseJsonBody<Record<string, unknown>>(request);
  if ("error" in parsed) return parsed.error;

  try {
    if (parsed.data.action === "note") {
      const customerId =
        typeof parsed.data.customerId === "string"
          ? parsed.data.customerId
          : "";
      const note =
        typeof parsed.data.note === "string" ? parsed.data.note.trim() : "";
      if (!customerId || !note || note.length > 2000) {
        return apiFail("Customer and note are required.", 400);
      }
      const created = await addCustomerNote(customerId, note, admin.id);
      return apiOk({ note: created }, 201);
    }

    if (parsed.data.action === "reminder") {
      const title =
        typeof parsed.data.title === "string" ? parsed.data.title.trim() : "";
      const dueAt =
        typeof parsed.data.dueAt === "string" ? parsed.data.dueAt : "";
      if (!title || !dueAt || Number.isNaN(Date.parse(dueAt))) {
        return apiFail("Reminder title and due date are required.", 400);
      }
      const reminder = await addReminder({
        customerId:
          typeof parsed.data.customerId === "string"
            ? parsed.data.customerId
            : undefined,
        orderId:
          typeof parsed.data.orderId === "string"
            ? parsed.data.orderId
            : undefined,
        title,
        details:
          typeof parsed.data.details === "string"
            ? parsed.data.details.trim()
            : undefined,
        dueAt,
        userId: admin.id,
      });
      return apiOk({ reminder }, 201);
    }

    return apiFail("Invalid CRM action.", 400);
  } catch (error) {
    console.error("CRM POST error:", error);
    return apiFail("Failed to save CRM activity.", 500);
  }
}

export async function PATCH(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return apiFail("Unauthorized.", 401);
  const parsed = await parseJsonBody<Record<string, unknown>>(request);
  if ("error" in parsed) return parsed.error;
  const id = typeof parsed.data.id === "string" ? parsed.data.id : "";
  if (!id) return apiFail("Reminder id required.", 400);
  try {
    await completeReminder(id);
    return apiOk({ completed: true });
  } catch (error) {
    console.error("CRM reminder PATCH error:", error);
    return apiFail("Failed to complete reminder.", 500);
  }
}
