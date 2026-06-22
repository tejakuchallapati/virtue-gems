import type { Order } from "@/types";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function sumRevenue(orders: Order[], from: Date, to: Date) {
  return orders
    .filter((o) => {
      const created = new Date(o.createdAt);
      return created >= from && created < to;
    })
    .reduce((sum, o) => sum + o.total, 0);
}

export function getDailyWeeklyMonthlyRevenue(orders: Order[]) {
  const now = new Date();
  const todayStart = startOfDay(now);
  const tomorrow = new Date(todayStart);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 6);

  const monthStart = new Date(todayStart);
  monthStart.setDate(1);

  const nextMonth = new Date(monthStart);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  return {
    daily: sumRevenue(orders, todayStart, tomorrow),
    weekly: sumRevenue(orders, weekStart, tomorrow),
    monthly: sumRevenue(orders, monthStart, nextMonth),
  };
}

export function getWeeklyChartData(orders: Order[]) {
  const now = new Date();
  const days: { name: string; sales: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    const dayStart = startOfDay(day);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const sales = orders
      .filter((o) => {
        const created = new Date(o.createdAt);
        return created >= dayStart && created < dayEnd;
      })
      .reduce((sum, o) => sum + o.total, 0);

    days.push({ name: DAY_NAMES[day.getDay()], sales });
  }

  return days;
}

export function getMonthlyTrendData(orders: Order[]) {
  const now = new Date();
  const months: { name: string; sales: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const next = new Date(month.getFullYear(), month.getMonth() + 1, 1);
    const label = month.toLocaleDateString("en-IN", { month: "short" });

    const sales = orders
      .filter((o) => {
        const created = new Date(o.createdAt);
        return created >= month && created < next;
      })
      .reduce((sum, o) => sum + o.total, 0);

    months.push({ name: label, sales });
  }

  return months;
}
