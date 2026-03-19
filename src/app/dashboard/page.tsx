import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FiTruck, FiBox, FiPackage, FiAlertTriangle } from "react-icons/fi";
import RecentLotsTable from "@/components/RecentLotsTable";
import AlertsBadge from "@/components/AlertsBadge";

export default async function DashboardPage() {
  const [supplierCount, productCount, lotCount, activeAlerts, recentLots, alerts] =
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
    ]);

  const stats = [
    { label: "Suppliers", value: supplierCount, icon: FiTruck, href: "/dashboard/suppliers", color: "text-blue-600 bg-blue-50" },
    { label: "Products", value: productCount, icon: FiBox, href: "/dashboard/products", color: "text-emerald-600 bg-emerald-50" },
    { label: "Lots", value: lotCount, icon: FiPackage, href: "/dashboard/lots", color: "text-violet-600 bg-violet-50" },
    { label: "Active Alerts", value: activeAlerts, icon: FiAlertTriangle, href: "/dashboard/alerts", color: "text-red-600 bg-red-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-secondary mt-1">Overview of your supply chain</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon size={22} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Recent Lots</h2>
            <Link href="/dashboard/lots" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <RecentLotsTable lots={recentLots} />
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Active Alerts</h2>
            <Link href="/dashboard/alerts" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <AlertsBadge alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
