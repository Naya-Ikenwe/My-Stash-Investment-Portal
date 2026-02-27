// app/dashboard/transaction-history/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { IoArrowBack, IoFilter, IoDownload, IoSearch, IoClose } from "react-icons/io5";
import { PiEmptyBold } from "react-icons/pi";
import {
  getTransactionsService,
  requestStatementReport,
} from "@/app/api/Users";
import TransactionFilters from "@/app/components/TransactionFilters";
import TransactionStats from "@/app/components/TransactionStats";
import TransactionTable from "@/app/components/TransactionTable";
import toast from "react-hot-toast";

type Transaction = {
  id: string;
  amount: number;
  type: "PAYMENT" | "TRANSFER" | "REFUND";
  intent:
    | "CREATE_PLAN"
    | "TOP_UP_PLAN"
    | "ROI_PAYOUT"
    | "LIQUIDATION"
    | "ROLLOVER"
    | "WITHDRAWAL";
  gatewayType: string;
  gatewayFee: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  reference: string;
  planId: string;
  userId: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    displayPhotoUrl: string;
  };
  bankAccount?: {
    accountName: string;
    accountNumber: string;
    isActive: boolean;
    bankCode: string;
    id: string;
    createdAt: string;
    userId: string;
  };
};

const defaultFilters = {
  page: 1,
  limit: 20,
  amount: undefined as number | undefined,
  type: "",
  intent: "",
  gatewayType: "",
  status: "",
  reference: "",
  planId: "",
  fromDate: "",
  toDate: "",
};

export default function TransactionHistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [statementLoading, setStatementLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [statementRange, setStatementRange] = useState({
    fromDate: "",
    toDate: "",
  });
  const [filters, setFilters] = useState(() => {
    const params: any = { ...defaultFilters };
    searchParams.forEach((value, key) => {
      if (key in params) params[key] = value;
    });
    return params;
  });

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiParams: any = { ...filters };
      apiParams.page = Number(apiParams.page) || 1;
      apiParams.limit = Number(apiParams.limit) || 20;

      Object.keys(apiParams).forEach((key) => {
        if (apiParams[key] === "" || apiParams[key] === undefined) {
          delete apiParams[key];
        }
      });

      const response = await getTransactionsService(apiParams);

      if (response?.data?.results) {
        setTransactions(response.data.results);
        setTotalCount(response.data.totalCount);
      } else {
        setTransactions([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      console.error("Error fetching transactions:", err);
      setError(err.response?.data?.message || "Failed to load transactions");
      setTransactions([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const updateURL = useCallback(
    (newFilters: any) => {
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value !== "" && key !== "page") {
          params.append(key, value.toString());
        }
      });
      const queryString = params.toString();
      const newUrl = queryString
        ? `/dashboard/transaction-history?${queryString}`
        : "/dashboard/transaction-history";
      router.replace(newUrl);
    },
    [router],
  );

  const handleFilterChange = (newFilters: any) => {
    const updatedFilters = { ...defaultFilters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    updateURL(defaultFilters);
  };

  const handleRequestStatement = async () => {
    if (!statementRange.fromDate || !statementRange.toDate) {
      setShowDatePicker(true);
      return;
    }

    try {
      setStatementLoading(true);

      // Convert dates to ISO format
      const payload = {
        fromDate: new Date(statementRange.fromDate).toISOString(),
        toDate: new Date(statementRange.toDate).toISOString(),
      };

      const response = await requestStatementReport(payload);

      toast.success("Statement request sent! Check your email for the PDF.");
      // Reset and close
      setStatementRange({ fromDate: "", toDate: "" });
      setShowDatePicker(false);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to request statement. Please try again.",
      );
    } finally {
      setStatementLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    const updatedFilters = { ...filters, page: newPage };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const totalPages = Math.ceil(totalCount / filters.limit);
  const currentPage = filters.page;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
<div className="mb-6 sm:mb-8">
  {/* Mobile-friendly header that maintains layout */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
    <div className="flex items-center gap-2 sm:gap-4">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-gray-600 hover:text-primary text-sm sm:text-base"
      >
        <IoArrowBack className="mr-1 sm:mr-2" />
        Back to Dashboard
      </Link>
      <h1 className="text-lg sm:text-2xl font-bold truncate">Transaction History</h1>
    </div>

    {/* Buttons stay in a row, just smaller on mobile */}
    <div className="flex items-center gap-2 sm:gap-3">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap ${
          showFilters
            ? "bg-primary text-white"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        <IoFilter className="text-sm sm:text-base" />
        Filters
      </button>

      <button
        onClick={() => setShowDatePicker(true)}
        disabled={statementLoading}
        className="px-2 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <IoDownload className="text-sm sm:text-base" />
        Download Statement
      </button>
    </div>
  </div>
</div>

      {/* Date Range Picker for Statement - Make responsive */}
      {showDatePicker && (
        <div className="mb-6 bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Select Statement Period</h3>
            <button
              onClick={() => setShowDatePicker(false)}
              className="text-gray-400 hover:text-gray-600 sm:hidden"
            >
              <IoClose size={24} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={statementRange.fromDate}
                onChange={(e) =>
                  setStatementRange({
                    ...statementRange,
                    fromDate: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={statementRange.toDate}
                onChange={(e) =>
                  setStatementRange({
                    ...statementRange,
                    toDate: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              onClick={() => setShowDatePicker(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleRequestStatement}
              disabled={
                !statementRange.fromDate ||
                !statementRange.toDate ||
                statementLoading
              }
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Request Statement
            </button>
          </div>
        </div>
      )}

      {/* Filters Panel - Make scrollable on mobile */}
      {showFilters && (
        <div className="mb-6 bg-white rounded-xl border border-gray-200 p-4 max-h-[80vh] sm:max-h-none overflow-y-auto sm:overflow-visible">
          <div className="flex justify-between items-center mb-4 sm:hidden">
            <h3 className="font-semibold">Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <IoClose size={24} />
            </button>
          </div>
          <TransactionFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 className="font-semibold">All Transactions</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Showing {transactions.length} of {totalCount} transactions
            </p>
          </div>

          {/* Mobile Search - Full width on mobile */}
          <div className="w-full sm:w-auto">
            <div className="relative">
              <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reference..."
                value={filters.reference}
                onChange={(e) =>
                  handleFilterChange({ ...filters, reference: e.target.value })
                }
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-4 sm:p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/3 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="p-8 sm:p-12 text-center">
            <div className="text-red-500 text-3xl sm:text-4xl mb-4">❌</div>
            <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">
              Error Loading Transactions
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchTransactions}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && transactions.length === 0 && (
          <div className="p-8 sm:p-12 text-center">
            <div className="text-gray-300 text-3xl sm:text-4xl mb-4">
              <PiEmptyBold className="inline-block" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">
              No Transactions Found
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4">
              {Object.values(filters).filter(
                (v) => v && v !== "" && v !== 1 && v !== 20,
              ).length > 0
                ? "Try adjusting your filters"
                : "No transactions have been made yet"}
            </p>
            {Object.values(filters).filter(
              (v) => v && v !== "" && v !== 1 && v !== 20,
            ).length > 0 && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Transactions Table */}
        {!isLoading && !error && transactions.length > 0 && (
          <>
            <TransactionTable transactions={transactions} />

            {/* Pagination - Make responsive */}
            {totalPages > 1 && (
              <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1 text-center sm:text-left">
                  Page {currentPage} of {totalPages}
                </div>
                
                {/* Mobile Pagination - Simplified */}
                <div className="flex items-center justify-center gap-2 order-1 sm:order-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
                  >
                    Prev
                  </button>

                  {/* Desktop Page Numbers */}
                  <div className="hidden sm:flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) pageNum = i + 1;
                      else if (currentPage <= 3) pageNum = i + 1;
                      else if (currentPage >= totalPages - 2)
                        pageNum = totalPages - 4 + i;
                      else pageNum = currentPage - 2 + i;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 rounded text-sm ${
                            currentPage === pageNum
                              ? "bg-primary text-white"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Mobile Page Indicator */}
                  <span className="sm:hidden text-sm">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
                  >
                    Next
                  </button>
                </div>

                {/* Per Page Select - Stack below on mobile */}
                <div className="flex items-center justify-center sm:justify-end gap-2 order-3">
                  <span className="text-xs sm:text-sm text-gray-600">Show:</span>
                  <select
                    value={filters.limit}
                    onChange={(e) =>
                      handleFilterChange({
                        ...filters,
                        limit: Number(e.target.value),
                        page: 1,
                      })
                    }
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <span className="hidden sm:inline text-xs sm:text-sm text-gray-600">per page</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}