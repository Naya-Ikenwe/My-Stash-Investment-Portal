import DashboardTopLevel from "@/app/components/DashboardTopLevel";
import Navbar from "@/app/components/Navbar";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <main className="flex flex-col lg:flex-row min-h-screen">
        <Navbar />
        <aside className="bg-white lg:rounded-tl-xl px-4 lg:px-6 py-4 w-full flex-1 overflow-y-auto">
          <div className="w-full flex items-end justify-end mb-4">
            <DashboardTopLevel />
          </div>
          {children}
        </aside>
      </main>
    </ProtectedRoute>
  );
}
