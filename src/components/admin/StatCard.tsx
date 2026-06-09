export function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl bg-dark-soft p-5 ring-1 ring-light/10">
      <p className="text-xs font-medium uppercase tracking-wider text-light/50">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-gold sm:text-3xl">{value}</p>
      {sub && <p className="mt-1 text-xs text-light/40">{sub}</p>}
    </div>
  );
}
