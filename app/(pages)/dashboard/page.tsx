import PortfolioCards from "@/app/components/PortfolioCards";
import PortfolioGrowth from "@/app/components/PortfolioGrowth";
import TransactionHistory from "@/app/components/TransactionHistory";

export default function Dashboard() {
  return (
    <main>
      <h2>Hello Shalom</h2>

      <hr className="my-4 border border-[#455A6433]" />

      <section className="flex gap-4">
        <div className="w-4/5 flex flex-col gap-4">
          <PortfolioCards />

          <div className="flex gap-4">
            <div className="w-[4/5]">
              <PortfolioGrowth />
            </div>

            <div className="w-[1/5]">
              <TransactionHistory />
            </div>
          </div>
        </div>

        <div className="w-1/5 bg-[#F7F7F7]">
          <p>Recent Activities</p>
        </div>
      </section>
    </main>
  );
}
