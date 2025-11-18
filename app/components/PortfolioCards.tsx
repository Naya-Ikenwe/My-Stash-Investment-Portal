import { FaPlus } from "react-icons/fa";

export default function PortfolioCards() {
  const cards = [
    {
      name: "Portfolio Balance",
      value: 100000,
    },
    {
      name: "Returns to Date",
      value: 100000,
    },
    {
      name: "Active Plans",
      value: 100000,
    },
  ];

  return (
    <main className="flex gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="w-full px-2 py-5 rounded-2xl bg-[#FAF1FF] border border-[#A243DC] flex flex-col gap-1"
        >
          <p className="text-[#A243DC]">{card.name}</p>
          <h2 className="text-[#263238] text-2xl font-medium">₦{card.value.toLocaleString()}</h2>
        </div>
      ))}

      <div className="bg-primary text-white flex flex-col gap-3 items-center justify-center w-full rounded-2xl">
        <FaPlus size={24} />
        <p>Create New Plan</p>
      </div>
    </main>
  );
}
