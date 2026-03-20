"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";

type TraceEvent = {
  id: string;
  eventType: string;
  temperature: number | null;
  createdAt: Date | string;
  location: string | null;
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-slate-900">{data.temp}°C</p>
      <p className="text-slate-500 text-xs mt-1">{data.eventType}</p>
      {data.location && (
        <p className="text-slate-400 text-xs">{data.location}</p>
      )}
      <p className="text-slate-400 text-xs mt-1">{data.date}</p>
    </div>
  );
}

export default function TemperatureChart({ events }: { events: TraceEvent[] }) {
  const data = events
    .filter((e) => e.temperature != null)
    .map((e) => ({
      date: new Date(e.createdAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      temp: e.temperature,
      eventType: e.eventType,
      location: e.location,
    }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        Aucune donnée de température enregistrée
      </div>
    );
  }

  const temps = data.map((d) => d.temp as number);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const padding = Math.max((maxTemp - minTemp) * 0.2, 2);

  const hasOutOfRange = temps.some((t) => t < 0 || t > 8);

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span>Temperature</span>
        </div>
        {hasOutOfRange && (
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-0.5 bg-red-400" />
            <span>Limites (0-8°C)</span>
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
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
          <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.5} />
          <ReferenceLine y={8} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.5} />
          <Area
            type="monotone"
            dataKey="temp"
            stroke="#3b82f6"
            strokeWidth={2.5}
            fill="url(#tempGradient)"
            dot={{ r: 4, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#2563eb", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
