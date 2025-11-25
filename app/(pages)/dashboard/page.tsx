import PortfolioCards from "@/app/components/PortfolioCards";
import PortfolioGrowth from "@/app/components/PortfolioGrowth";
import RecentActivities from "@/app/components/RecentActivities";
import TransactionHistory from "@/app/components/TransactionHistory";

export default function Dashboard() {
  return (
    <main>
      <h2 className="text-3xl font-medium">Hello <span className="text-primary">Shalom,</span> </h2>

      <hr className="my-4 border border-[#455A6433]" />

      <section className="flex gap-4">
        <div className="w-4/5 flex flex-col gap-4">
          <PortfolioCards />

          <div className="flex gap-4">
            <div className="w-3/5">
              <PortfolioGrowth />
            </div>

            <div className="w-2/5">
              <TransactionHistory />
            </div>
          </div>
        </div>

        <RecentActivities />
      </section>
    </main>
  );
}
