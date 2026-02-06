// app/dashboard/transaction-history/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { IoArrowBack, IoFilter, IoDownload, IoSearch } from "react-icons/io5";
import { PiEmptyBold } from "react-icons/pi";
import { getTransactionsService } from "@/app/api/Users";
import TransactionFilters from "@/app/components/TransactionFilters";
import TransactionStats from "@/app/components/TransactionStats";
import TransactionTable from "@/app/components/TransactionTable";
import { generateCSVData } from "../utils/transactionUtils";

type Transaction = {
  id: string;
  amount: number;
  type: "PAYMENT" | "TRANSFER" | "REFUND";
  intent: "CREATE_PLAN" | "TOP_UP_PLAN" | "ROI_PAYOUT" | "LIQUIDATION" | "ROLLOVER" | "WITHDRAWAL";
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
  const [exportLoading, setExportLoading] = useState(false);
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
      
      Object.keys(apiParams).forEach(key => {
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

  const updateURL = useCallback((newFilters: any) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "" && key !== "page") {
        params.append(key, value.toString());
      }
    });
    const queryString = params.toString();
    const newUrl = queryString ? `/dashboard/transaction-history?${queryString}` : "/dashboard/transaction-history";
    router.replace(newUrl);
  }, [router]);

  const handleFilterChange = (newFilters: any) => {
    const updatedFilters = { ...defaultFilters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    updateURL(defaultFilters);
  };

  const handleExportCSV = async () => {
    try {
      setExportLoading(true);
      const exportParams = { ...filters, limit: 1000, page: 1 };
      const response = await getTransactionsService(exportParams);
      const transactions = response.data.results;
      
      const csvContent = generateCSVData(transactions);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export transactions");
    } finally {
      setExportLoading(false);
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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center text-gray-600 hover:text-primary"
            >
              <IoArrowBack className="mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold">Transaction History</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                showFilters ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              <IoFilter />
              Filters
            </button>
            
            <button
              onClick={handleExportCSV}
              disabled={exportLoading || transactions.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IoDownload />
              {exportLoading ? "Exporting..." : "Export CSV"}
            </button>
          </div>
        </div>
        
        <TransactionStats 
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 bg-white rounded-xl border border-gray-200 p-4">
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
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="font-semibold">All Transactions</h3>
            <p className="text-sm text-gray-600">
              Showing {transactions.length} of {totalCount} transactions
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by reference..."
                value={filters.reference}
                onChange={(e) => handleFilterChange({ ...filters, reference: e.target.value })}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
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
          <div className="p-12 text-center">
            <div className="text-red-500 text-4xl mb-4">❌</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Error Loading Transactions</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchTransactions}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && transactions.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-gray-300 text-4xl mb-4">
              <PiEmptyBold className="inline-block" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Transactions Found</h3>
            <p className="text-gray-500 mb-4">
              {Object.values(filters).filter(v => v && v !== "" && v !== 1 && v !== 20).length > 0
                ? "Try adjusting your filters"
                : "No transactions have been made yet"
              }
            </p>
            {Object.values(filters).filter(v => v && v !== "" && v !== 1 && v !== 20).length > 0 && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
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
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded ${
                          currentPage === pageNum
                            ? "bg-primary text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Show:</span>
                  <select
                    value={filters.limit}
                    onChange={(e) => handleFilterChange({ ...filters, limit: Number(e.target.value), page: 1 })}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <span className="text-sm text-gray-600">per page</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}