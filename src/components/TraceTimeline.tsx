const eventIcons: Record<string, string> = {
  RECEIVED: "📦",
  INSPECTED: "🔍",
  STORED: "🏭",
  PROCESSED: "⚙️",
  SHIPPED: "🚚",
  RECALLED: "⚠️",
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
    return <p className="text-secondary text-sm">No trace events recorded yet.</p>;
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
      <div className="space-y-4">
        {events.map((event, i) => (
          <div key={event.id} className="relative pl-10">
            <div className="absolute left-2 top-1 w-5 h-5 rounded-full bg-card border-2 border-primary flex items-center justify-center text-xs">
              {eventIcons[event.eventType] || "•"}
            </div>
            <div className={`p-3 rounded-lg border border-border ${i === events.length - 1 ? "bg-primary-light/30" : "bg-card"}`}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{event.eventType}</span>
                <span className="text-xs text-secondary">
                  {new Date(event.createdAt).toLocaleString()}
                </span>
              </div>
              {event.description && <p className="text-sm text-secondary mt-1">{event.description}</p>}
              <div className="flex gap-4 mt-1 text-xs text-secondary">
                {event.location && <span>📍 {event.location}</span>}
                {event.temperature != null && <span>🌡️ {event.temperature}°C</span>}
                {event.performedBy && <span>👤 {event.performedBy}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
