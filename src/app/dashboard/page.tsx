import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FiTruck, FiBox, FiPackage, FiAlertTriangle, FiThermometer, FiTrendingUp } from "react-icons/fi";
import RecentLotsTable from "@/components/RecentLotsTable";
import AlertsBadge from "@/components/AlertsBadge";
import DashboardTemperatureChart from "@/components/DashboardTemperatureChart";

export default async function DashboardPage() {
  const [supplierCount, productCount, lotCount, activeAlerts, recentLots, alerts, tempEvents] =
    await Promise.all([
      prisma.supplier.count(),
      prisma.product.count(),
      prisma.lot.count(),
      prisma.alert.count({ where: { status: "ACTIVE" } }),
      prisma.lot.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { product: true, supplier: true },
      }),
      prisma.alert.findMany({
        take: 5,
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        include: { lot: true },
      }),
      prisma.traceEvent.findMany({
        where: { temperature: { not: null } },
        orderBy: { createdAt: "asc" },
        take: 30,
        include: { lot: { select: { lotNumber: true } } },
      }),
    ]);

  const stats = [
    { label: "Fournisseurs", value: supplierCount, icon: FiTruck, href: "/dashboard/suppliers", color: "text-blue-600", bg: "bg-blue-50", ring: "ring-blue-100" },
    { label: "Produits", value: productCount, icon: FiBox, href: "/dashboard/products", color: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-100" },
    { label: "Lots", value: lotCount, icon: FiPackage, href: "/dashboard/lots", color: "text-violet-600", bg: "bg-violet-50", ring: "ring-violet-100" },
    { label: "Alertes actives", value: activeAlerts, icon: FiAlertTriangle, href: "/dashboard/alerts", color: "text-red-600", bg: "bg-red-50", ring: "ring-red-100" },
  ];

  const chartData = tempEvents.map((e) => ({
    temp: e.temperature as number,
    date: new Date(e.createdAt).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
    }),
    lotNumber: e.lot.lotNumber,
    eventType: e.eventType,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-secondary mt-1 text-sm">Vue d'ensemble de votre chaine d'approvisionnement</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:shadow-slate-200/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-secondary uppercase tracking-wide">{stat.label}</p>
                <p className="text-3xl font-bold mt-2 tracking-tight">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} ring-1 ${stat.ring} group-hover:scale-110 transition-transform`}>
                <stat.icon size={22} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <FiThermometer size={18} />
            </div>
            <div>
              <h2 className="font-semibold">Suivi des températures</h2>
              <p className="text-xs text-secondary">Derniers relevés de température</p>
            </div>
          </div>
          <Link href="/dashboard/lots" className="text-xs text-primary hover:underline font-medium">
            Voir les lots
          </Link>
        </div>
        <DashboardTemperatureChart events={chartData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-violet-50 rounded-lg text-violet-600">
                <FiPackage size={18} />
              </div>
              <h2 className="font-semibold">Lots récents</h2>
            </div>
            <Link href="/dashboard/lots" className="text-xs text-primary hover:underline font-medium">
              Voir tout
            </Link>
          </div>
          <RecentLotsTable lots={recentLots} />
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-50 rounded-lg text-red-600">
                <FiAlertTriangle size={18} />
              </div>
              <h2 className="font-semibold">Alertes actives</h2>
            </div>
            <Link href="/dashboard/alerts" className="text-xs text-primary hover:underline font-medium">
              Voir tout
            </Link>
          </div>
          <AlertsBadge alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
