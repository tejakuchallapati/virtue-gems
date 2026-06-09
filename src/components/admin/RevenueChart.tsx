"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const chartData = [
  { name: "Mon", sales: 45000 },
  { name: "Tue", sales: 32000 },
  { name: "Wed", sales: 78000 },
  { name: "Thu", sales: 56000 },
  { name: "Fri", sales: 91000 },
  { name: "Sat", sales: 120000 },
  { name: "Sun", sales: 85000 },
];

export function RevenueChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
          <Tooltip
            contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8 }}
            labelStyle={{ color: "#d4af37" }}
          />
          <Bar dataKey="sales" fill="#d4af37" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
