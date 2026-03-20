"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

type Event = {
  temp: number;
  date: string;
  lotNumber: string;
  eventType: string;
};

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-slate-900">{d.temp}°C</p>
      <p className="text-slate-500 text-xs mt-0.5">Lot {d.lotNumber}</p>
      <p className="text-slate-400 text-xs">{d.eventType} - {d.date}</p>
    </div>
  );
}

export default function DashboardTemperatureChart({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        Aucune donnée de température
      </div>
    );
  }

  const temps = events.map((e) => e.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const padding = Math.max((maxTemp - minTemp) * 0.2, 2);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={events} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="dashTempGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={{ stroke: "#e2e8f0" }}
          tickLine={false}
        />
        <YAxis
          domain={[minTemp - padding, maxTemp + padding]}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}°`}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.4} />
        <ReferenceLine y={8} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.4} />
        <Area
          type="monotone"
          dataKey="temp"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#dashTempGradient)"
          dot={{ r: 3, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
          activeDot={{ r: 5, fill: "#2563eb", stroke: "#fff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
