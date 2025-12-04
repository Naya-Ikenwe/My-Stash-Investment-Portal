export interface Transaction {
  id: number;
  type: "deposit" | "interest" | "withdrawal";
  amount: number;
  date: string;
}

export interface Saving {
  id: number;
  title: string;
  amount: number;
  status: "Active" | "Matured";
  plan: string;
  maturityDate: string;
  transactions?: Transaction[];
  accountHolderName?: string; // for matured plans
  accountNumber?: string; // for matured plans
}

export const savings: Saving[] = [
  {
    id: 1,
    title: "Rent",
    amount: 1000000,
    status: "Active",
    plan: "Plan A",
    maturityDate: "01/04/26", // ~31 days - Maturing Soon

    transactions: [
      { id: 1, type: "deposit", amount: 200000, date: "2024-01-02" },
      { id: 2, type: "interest", amount: 15000, date: "2024-02-01" },
      { id: 3, type: "withdrawal", amount: 100000, date: "2024-03-12" },
    ],
  },
  {
    id: 2,
    title: "Investment Savings",
    amount: 100000,
    status: "Matured",
    plan: "Plan C",
    maturityDate: "04/04/26", // ~122 days - 3-6 Months
    accountHolderName: "Olatipe Osatuyi",
    accountNumber: "1234567890",

    transactions: [
      { id: 1, type: "deposit", amount: 200000, date: "2024-01-02" },
      { id: 2, type: "interest", amount: 15000, date: "2024-02-01" },
      { id: 3, type: "withdrawal", amount: 100000, date: "2024-03-12" },
    ],
  },
  {
    id: 3,
    title: "New Car",
    amount: 5000000,
    status: "Active",
    plan: "Plan B",
    maturityDate: "06/04/26", // ~183 days - 6-12 Months

    transactions: [
      { id: 1, type: "deposit", amount: 200000, date: "2024-01-02" },
      { id: 2, type: "interest", amount: 15000, date: "2024-02-01" },
      { id: 3, type: "withdrawal", amount: 100000, date: "2024-03-12" },
    ],
  },
  {
    id: 4,
    title: "New House",
    amount: 3000000,
    status: "Active",
    plan: "Plan A",
    maturityDate: "12/04/27", // ~730+ days - Later (1+ year)

    transactions: [
      { id: 1, type: "deposit", amount: 200000, date: "2024-01-02" },
      { id: 2, type: "interest", amount: 15000, date: "2024-02-01" },
      { id: 3, type: "withdrawal", amount: 100000, date: "2024-03-12" },
    ],
  },
  {
    id: 5,
    title: "MacBook Pro",
    amount: 1000000,
    status: "Active",
    plan: "Plan B",
    maturityDate: "02/04/26", // ~61 days - Maturing Soon

    transactions: [
      { id: 1, type: "deposit", amount: 200000, date: "2024-01-02" },
      { id: 2, type: "interest", amount: 15000, date: "2024-02-01" },
      { id: 3, type: "withdrawal", amount: 100000, date: "2024-03-12" },
    ],
  },
  {
    id: 6,
    title: "iPhone 16",
    amount: 1000000,
    status: "Matured",
    plan: "Plan C",
    maturityDate: "05/04/26", // ~152 days - 3-6 Months
    accountHolderName: "Olatipe Osatuyi",
    accountNumber: "1234567890",

    transactions: [
      { id: 1, type: "deposit", amount: 200000, date: "2024-01-02" },
      { id: 2, type: "interest", amount: 15000, date: "2024-02-01" },
      { id: 3, type: "withdrawal", amount: 100000, date: "2024-03-12" },
    ],
  },
  {
    id: 7,
    title: "Convocation",
    amount: 50000,
    status: "Matured",
    plan: "Plan B",
    maturityDate: "09/04/26", // ~247 days - 6-12 Months
    accountHolderName: "Olatipe Osatuyi",
    accountNumber: "1234567890",

    transactions: [
      { id: 1, type: "deposit", amount: 200000, date: "2024-01-02" },
      { id: 2, type: "interest", amount: 15000, date: "2024-02-01" },
      { id: 3, type: "withdrawal", amount: 100000, date: "2024-03-12" },
    ],
  },
  {
    id: 8,
    title: "Japa to UK",
    amount: 30000000,
    status: "Active",
    plan: "Plan C",
    maturityDate: "06/04/27", // ~549+ days - Later (1+ year)

    transactions: [
      { id: 1, type: "deposit", amount: 200000, date: "2024-01-02" },
      { id: 2, type: "interest", amount: 15000, date: "2024-02-01" },
      { id: 3, type: "withdrawal", amount: 100000, date: "2024-03-12" },
    ],
  },
];
