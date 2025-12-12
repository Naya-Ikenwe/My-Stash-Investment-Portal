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
      <main className="flex">
        <Navbar />
        <aside className="bg-white rounded-tl-xl px-6 py-4 w-full">
          <div className="w-full flex items-end justify-end">
            <DashboardTopLevel />
          </div>
          {children}
        </aside>
      </main>
    </ProtectedRoute>
  );
}
