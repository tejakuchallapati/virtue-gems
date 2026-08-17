"use client";

import { FormEvent, useState } from "react";
import { Shield, UserPlus } from "lucide-react";
import { apiFetch } from "@/lib/api-client";
import type { AdminProfile, AdminRole } from "@/types";

const roles: AdminRole[] = ["owner", "admin", "staff"];

export function AdminTeam({ initialAdmins }: { initialAdmins: AdminProfile[] }) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("staff");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    const res = await apiFetch<{ admins?: AdminProfile[] }>("/api/admin/team");
    if (res.ok) setAdmins(res.data.admins ?? []);
  }

  async function createAdmin(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await apiFetch("/api/admin/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, displayName, password, role }),
    });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setEmail("");
    setDisplayName("");
    setPassword("");
    setRole("staff");
    await refresh();
  }

  async function updateAdmin(
    id: string,
    patch: { role?: AdminRole; active?: boolean },
  ) {
    setError("");
    const res = await apiFetch("/api/admin/team", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    if (!res.ok) return setError(res.error);
    await refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-light">Admin team</h1>
      <p className="mt-1 text-sm text-light/50">
        Owner controls access; admins manage the CRM; staff handle daily orders.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <form
          onSubmit={createAdmin}
          className="h-fit space-y-3 rounded-2xl bg-dark-soft p-5 ring-1 ring-light/10"
        >
          <h2 className="flex items-center gap-2 font-medium text-gold">
            <UserPlus className="h-4 w-4" /> Add team member
          </h2>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display name"
            className="w-full rounded-xl border border-light/10 bg-dark p-3 text-base text-light outline-none focus:border-gold/40"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-light/10 bg-dark p-3 text-base text-light outline-none focus:border-gold/40"
          />
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Temporary password (8+)"
            className="w-full rounded-xl border border-light/10 bg-dark p-3 text-base text-light outline-none focus:border-gold/40"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
            className="w-full rounded-xl border border-light/10 bg-dark p-3 text-base text-light outline-none focus:border-gold/40"
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
          </select>
          <button
            disabled={busy}
            className="min-h-11 w-full rounded-xl bg-gold font-semibold text-dark disabled:opacity-50"
          >
            {busy ? "Creating…" : "Create account"}
          </button>
        </form>

        <div className="min-w-0 space-y-3">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="flex flex-col gap-3 rounded-2xl bg-dark-soft p-4 ring-1 ring-light/10 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-medium text-light">
                  <Shield className="h-4 w-4 text-gold" />
                  <span className="truncate">
                    {admin.displayName || admin.email}
                  </span>
                </p>
                <p className="mt-1 truncate text-xs text-light/45">
                  {admin.email}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                <select
                  value={admin.role}
                  onChange={(e) =>
                    void updateAdmin(admin.id, {
                      role: e.target.value as AdminRole,
                    })
                  }
                  className="min-h-11 rounded-lg border border-light/10 bg-dark px-3 py-2 text-sm text-light"
                >
                  {roles.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() =>
                    void updateAdmin(admin.id, { active: !admin.active })
                  }
                  className={`min-h-11 rounded-lg px-3 py-2 text-sm ${
                    admin.active
                      ? "bg-green-500/15 text-green-400"
                      : "bg-red-500/15 text-red-400"
                  }`}
                >
                  {admin.active ? "Active" : "Disabled"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
    </div>
  );
}
