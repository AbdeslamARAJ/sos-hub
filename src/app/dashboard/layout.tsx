import { requireAuth } from "@/lib/session";
import Sidebar from "@/components/Sidebar";
import SessionProvider from "@/components/SessionProvider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <SessionProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pt-16 lg:pt-8">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
