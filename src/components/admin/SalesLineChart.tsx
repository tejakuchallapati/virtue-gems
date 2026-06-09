"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const daily = [
  { day: "1", sales: 12000 },
  { day: "5", sales: 18000 },
  { day: "10", sales: 25000 },
  { day: "15", sales: 32000 },
  { day: "20", sales: 28000 },
  { day: "25", sales: 45000 },
  { day: "30", sales: 38000 },
];

export function SalesLineChart() {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={daily}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8 }} />
          <Line type="monotone" dataKey="sales" stroke="#d4af37" strokeWidth={2} dot={{ fill: "#d4af37" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
