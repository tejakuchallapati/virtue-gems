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

type ChartPoint = { name: string; sales: number };

export function SalesLineChart({ data }: { data: ChartPoint[] }) {
  const chartData = data.map((point) => ({ day: point.name, sales: point.sales }));
  const hasSales = chartData.some((point) => point.sales > 0);

  if (!hasSales) {
    return (
      <p className="flex h-72 items-center justify-center text-sm text-light/40">
        No sales data yet for recent months.
      </p>
    );
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8 }} />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#d4af37"
            strokeWidth={2}
            dot={{ fill: "#d4af37" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
