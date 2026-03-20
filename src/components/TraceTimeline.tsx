import { FiPackage, FiSearch, FiHome, FiSettings, FiTruck, FiAlertTriangle } from "react-icons/fi";

const eventConfig: Record<string, { icon: typeof FiPackage; color: string; bg: string }> = {
  RECEIVED: { icon: FiPackage, color: "text-blue-600", bg: "bg-blue-100" },
  INSPECTED: { icon: FiSearch, color: "text-indigo-600", bg: "bg-indigo-100" },
  STORED: { icon: FiHome, color: "text-slate-600", bg: "bg-slate-100" },
  PROCESSED: { icon: FiSettings, color: "text-violet-600", bg: "bg-violet-100" },
  SHIPPED: { icon: FiTruck, color: "text-emerald-600", bg: "bg-emerald-100" },
  RECALLED: { icon: FiAlertTriangle, color: "text-red-600", bg: "bg-red-100" },
};

type TraceEvent = {
  id: string;
  eventType: string;
  location: string | null;
  description: string | null;
  temperature: number | null;
  performedBy: string | null;
  createdAt: Date;
};

export default function TraceTimeline({ events }: { events: TraceEvent[] }) {
  if (events.length === 0) {
    return <p className="text-secondary text-sm">Aucun événement de traçabilité enregistré.</p>;
  }

  return (
    <div className="relative">
      <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-slate-200 to-transparent" />
      <div className="space-y-4">
        {events.map((event, i) => {
          const config = eventConfig[event.eventType] || { icon: FiPackage, color: "text-slate-600", bg: "bg-slate-100" };
          const Icon = config.icon;
          return (
            <div key={event.id} className="relative pl-12">
              <div className={`absolute left-1.5 top-2 w-8 h-8 rounded-xl ${config.bg} ${config.color} flex items-center justify-center`}>
                <Icon size={14} />
              </div>
              <div className={`p-4 rounded-xl border transition-all ${
                i === events.length - 1
                  ? "border-blue-200 bg-blue-50/50 shadow-sm"
                  : "border-border bg-card hover:shadow-sm"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{event.eventType.replace("_", " ")}</span>
                  <span className="text-xs text-secondary bg-slate-100 px-2 py-0.5 rounded-md">
                    {new Date(event.createdAt).toLocaleString("fr-FR")}
                  </span>
                </div>
                {event.description && <p className="text-sm text-secondary mt-1.5">{event.description}</p>}
                <div className="flex gap-4 mt-2 text-xs text-secondary">
                  {event.location && (
                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md">
                      <span className="text-slate-400">Lieu:</span> {event.location}
                    </span>
                  )}
                  {event.temperature != null && (
                    <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-medium">
                      {event.temperature}°C
                    </span>
                  )}
                  {event.performedBy && (
                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md">
                      <span className="text-slate-400">Par:</span> {event.performedBy}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
