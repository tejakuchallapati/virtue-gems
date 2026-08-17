"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Download,
  MessageCircle,
  Search,
  StickyNote,
  UserRound,
} from "lucide-react";
import { apiFetch } from "@/lib/api-client";
import { formatDate, formatPrice } from "@/lib/utils";
import { getCustomerWhatsAppUrl } from "@/lib/whatsapp-admin";
import type {
  Customer,
  CustomerNote,
  FollowUpReminder,
  Order,
} from "@/types";

export function CustomerCrm({
  initialCustomers,
  initialOrders,
  initialReminders,
  initialNotes = [],
  setupRequired = false,
}: {
  initialCustomers: Customer[];
  initialOrders: Order[];
  initialReminders: FollowUpReminder[];
  initialNotes?: CustomerNote[];
  setupRequired?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    initialCustomers[0]?.id ?? null,
  );
  const [notes, setNotes] = useState<CustomerNote[]>(initialNotes);
  const [reminders, setReminders] = useState(initialReminders);
  const [noteText, setNoteText] = useState("");
  const [reminderTitle, setReminderTitle] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return initialCustomers;
    return initialCustomers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(needle) ||
        customer.phone.includes(needle),
    );
  }, [initialCustomers, query]);

  const selected =
    initialCustomers.find((customer) => customer.id === selectedId) ?? null;
  const selectedOrders = selected
    ? initialOrders.filter((order) => order.phone === selected.phone)
    : [];

  async function selectCustomer(id: string) {
    setSelectedId(id);
    setError("");
    const res = await apiFetch<{ notes?: CustomerNote[] }>(
      `/api/admin/crm?customerId=${encodeURIComponent(id)}`,
    );
    if (res.ok) setNotes(res.data.notes ?? []);
  }

  async function saveNote(e: FormEvent) {
    e.preventDefault();
    if (!selected || !noteText.trim()) return;
    setBusy(true);
    setError("");
    const res = await apiFetch<{ note?: CustomerNote }>("/api/admin/crm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "note",
        customerId: selected.id,
        note: noteText,
      }),
    });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    if (res.data.note) setNotes((current) => [res.data.note!, ...current]);
    setNoteText("");
  }

  async function saveReminder(e: FormEvent) {
    e.preventDefault();
    if (!selected || !reminderTitle.trim() || !dueAt) return;
    setBusy(true);
    setError("");
    const res = await apiFetch<{ reminder?: FollowUpReminder }>(
      "/api/admin/crm",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reminder",
          customerId: selected.id,
          title: reminderTitle,
          dueAt: new Date(dueAt).toISOString(),
        }),
      },
    );
    setBusy(false);
    if (!res.ok) return setError(res.error);
    if (res.data.reminder) {
      setReminders((current) => [...current, res.data.reminder!]);
    }
    setReminderTitle("");
    setDueAt("");
  }

  async function markComplete(id: string) {
    const res = await apiFetch("/api/admin/crm", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) return setError(res.error);
    setReminders((current) =>
      current.map((reminder) =>
        reminder.id === id
          ? { ...reminder, completedAt: new Date().toISOString() }
          : reminder,
      ),
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-light">Customer CRM</h1>
          <p className="mt-1 text-sm text-light/50">
            Order history, notes, WhatsApp follow-ups and reminders.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/api/admin/export?type=customers"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gold/25 px-3 text-xs text-gold"
          >
            <Download className="h-4 w-4" /> Customers CSV
          </a>
          <a
            href="/api/admin/export?type=orders"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gold/25 px-3 text-xs text-gold"
          >
            <Download className="h-4 w-4" /> Orders CSV
          </a>
        </div>
      </div>

      {setupRequired && (
        <div className="mt-5 rounded-xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm text-amber-200">
          Connect Supabase and run the CRM migration to enable permanent
          customer records, notes and reminders.
        </div>
      )}

      <div className="mt-6 grid min-w-0 gap-5 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="min-w-0 rounded-2xl bg-dark-soft p-3 ring-1 ring-light/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-light/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or phone"
              className="w-full rounded-xl border border-light/10 bg-dark py-3 pl-10 pr-3 text-base text-light outline-none focus:border-gold/40"
            />
          </div>
          <div className="mt-3 max-h-[65dvh] space-y-2 overflow-y-auto">
            {filtered.map((customer) => (
              <button
                type="button"
                key={customer.id}
                onClick={() => void selectCustomer(customer.id)}
                className={`w-full rounded-xl p-3 text-left transition ${
                  selectedId === customer.id
                    ? "bg-gold/15 ring-1 ring-gold/30"
                    : "bg-dark hover:bg-light/5"
                }`}
              >
                <p className="truncate text-sm font-medium text-light">
                  {customer.name}
                </p>
                <p className="mt-1 text-xs text-light/50">{customer.phone}</p>
                <p className="mt-1 text-[11px] text-gold/80">
                  {customer.totalOrders} orders ·{" "}
                  {formatPrice(customer.totalSpent)}
                </p>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="p-4 text-center text-sm text-light/40">
                No matching customers.
              </p>
            )}
          </div>
        </aside>

        <section className="min-w-0">
          {!selected ? (
            <div className="rounded-2xl bg-dark-soft p-10 text-center text-light/40">
              <UserRound className="mx-auto h-8 w-8" />
              <p className="mt-3">Select a customer to see their history.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="rounded-2xl bg-dark-soft p-5 ring-1 ring-light/10">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold text-light">
                      {selected.name}
                    </h2>
                    <p className="mt-1 text-sm text-light/55">
                      {selected.phone}
                    </p>
                    <p className="mt-1 text-xs text-light/40">
                      {[selected.address, selected.city, selected.state, selected.pincode]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                  <a
                    href={getCustomerWhatsAppUrl(
                      selected.phone,
                      `Hello ${selected.name}, this is Virtue Gems.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#25D366]/15 px-4 text-sm text-[#25D366]"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                <div className="rounded-2xl bg-dark-soft p-4 ring-1 ring-light/10">
                  <h3 className="flex items-center gap-2 font-medium text-gold">
                    <StickyNote className="h-4 w-4" /> Internal notes
                  </h3>
                  <form onSubmit={saveNote} className="mt-3">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Sizing preference, follow-up context, customer request…"
                      maxLength={2000}
                      className="min-h-24 w-full resize-y rounded-xl border border-light/10 bg-dark p-3 text-base text-light outline-none focus:border-gold/40"
                    />
                    <button
                      disabled={busy || !noteText.trim()}
                      className="mt-2 min-h-11 rounded-xl bg-gold px-4 text-sm font-medium text-dark disabled:opacity-50"
                    >
                      Save note
                    </button>
                  </form>
                  <div className="mt-4 space-y-2">
                    {notes.map((note) => (
                      <div key={note.id} className="rounded-xl bg-dark p-3">
                        <p className="text-sm text-light/75">{note.note}</p>
                        <p className="mt-1 text-[10px] text-light/35">
                          {formatDate(note.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-dark-soft p-4 ring-1 ring-light/10">
                  <h3 className="flex items-center gap-2 font-medium text-gold">
                    <CalendarClock className="h-4 w-4" /> Follow-up reminder
                  </h3>
                  <form onSubmit={saveReminder} className="mt-3 space-y-2">
                    <input
                      value={reminderTitle}
                      onChange={(e) => setReminderTitle(e.target.value)}
                      placeholder="Confirm payment, ask for review…"
                      className="w-full rounded-xl border border-light/10 bg-dark p-3 text-base text-light outline-none focus:border-gold/40"
                    />
                    <input
                      type="datetime-local"
                      value={dueAt}
                      onChange={(e) => setDueAt(e.target.value)}
                      className="w-full rounded-xl border border-light/10 bg-dark p-3 text-base text-light outline-none focus:border-gold/40"
                    />
                    <button
                      disabled={busy || !reminderTitle || !dueAt}
                      className="min-h-11 rounded-xl bg-gold px-4 text-sm font-medium text-dark disabled:opacity-50"
                    >
                      Add reminder
                    </button>
                  </form>
                  <div className="mt-4 space-y-2">
                    {reminders
                      .filter((reminder) => reminder.customerId === selected.id)
                      .map((reminder) => (
                        <div
                          key={reminder.id}
                          className="flex items-start justify-between gap-3 rounded-xl bg-dark p-3"
                        >
                          <div className="min-w-0">
                            <p
                              className={`text-sm ${reminder.completedAt ? "text-light/35 line-through" : "text-light/75"}`}
                            >
                              {reminder.title}
                            </p>
                            <p className="mt-1 text-[10px] text-light/35">
                              Due {formatDate(reminder.dueAt)}
                            </p>
                          </div>
                          {!reminder.completedAt && (
                            <button
                              type="button"
                              onClick={() => void markComplete(reminder.id)}
                              aria-label="Complete reminder"
                              className="shrink-0 text-green-400"
                            >
                              <CheckCircle2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-dark-soft p-4 ring-1 ring-light/10">
                <h3 className="font-medium text-gold">
                  Complete order history ({selectedOrders.length})
                </h3>
                <div className="mt-3 space-y-3">
                  {selectedOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-xl bg-dark p-3 sm:flex sm:items-start sm:justify-between sm:gap-4"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-light">
                          {order.id}
                        </p>
                        <p className="mt-1 text-xs text-light/45">
                          {formatDate(order.createdAt)} · {order.status}
                        </p>
                        <p className="mt-2 text-xs text-light/55">
                          {order.items
                            .map((item) => `${item.name} × ${item.quantity}`)
                            .join(", ")}
                        </p>
                      </div>
                      <p className="mt-2 shrink-0 font-semibold text-gold sm:mt-0">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </section>
      </div>
    </div>
  );
}
