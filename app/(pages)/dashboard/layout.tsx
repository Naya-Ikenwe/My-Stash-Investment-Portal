import DashboardTopLevel from "@/app/components/DashboardTopLevel";
import Navbar from "@/app/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex">
      <Navbar />
      <aside className="bg-white rounded-tl-xl px-6 py-4 w-full">
        <DashboardTopLevel />
        {children}
      </aside>
    </main>
  );
}
