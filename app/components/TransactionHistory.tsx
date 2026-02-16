"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PiEmptyBold } from "react-icons/pi";
import { DashboardResponse } from "@/app/api/dashboard";
import { getTransactionsService } from "@/app/api/Users";

// Keep the types local to the component since they're only used here
type TransactionUser = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  displayPhotoUrl: string;
};

type TransactionBankAccount = {
  accountName: string;
  accountNumber: string;
  isActive: boolean;
  bankCode: string;
  id: string;
  createdAt: string;
  userId: string;
};

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
  user: TransactionUser;
  bankAccount?: TransactionBankAccount;
};

type TransactionHistoryProps = {
  dashboardData?: DashboardResponse['data'] | null; // Make optional
  isLoading?: boolean;
  planId?: string; // NEW: Optional planId prop for filtering
};

export default function TransactionHistory({ 
  dashboardData, 
  isLoading = false,
  planId // NEW: Optional planId
}: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async (pageNum: number = 1) => {
    try {
      setTransactionsLoading(true);
      setError(null);
      
      // Build query params - ADD planId if provided
      const queryParams: any = {
        page: pageNum,
        limit: limit,
        status: 'SUCCESS',
      };
      
      // Add planId to filter if provided
      if (planId) {
        queryParams.planId = planId;
        console.log(`🔍 Fetching transactions for plan: ${planId}`);
      }
      
      // Use the service function from user.ts
      const response = await getTransactionsService(queryParams);
      
      if (response?.data?.results) {
        setTransactions(response.data.results);
        setTotalCount(response.data.totalCount);
        setPage(response.data.page);
      } else {
        setTransactions([]);
        setTotalCount(0);
      }
      
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      setError(err.response?.data?.message || 'Failed to fetch transactions');
      setTransactions([]);
      setTotalCount(0);
    } finally {
      setTransactionsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      fetchTransactions();
    }
  }, [isLoading, planId]); // Add planId to dependency array

  // Helper function to format transaction type for display
  const formatTransactionType = (type: string, intent: string): string => {
    const intentMap: Record<string, string> = {
      'ACTIVATE_PLAN': 'Investment Created',
      'TOP_UP_PLAN': 'Investment Top-up',
      'ROI_PAYOUT': 'ROI Payout',
      'LIQUIDATION': 'Investment Liquidated',
      'ROLLOVER': 'Investment Rolled Over',
      'WITHDRAWAL': 'Withdrawal',
    };

    return intentMap[intent] || type.toLowerCase();
  };

  // Helper function to get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'SUCCESS': return 'text-green-600';
      case 'PENDING': return 'text-yellow-600';
      case 'FAILED': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  if (isLoading || transactionsLoading) {
    return (
      <div className="bg-[#F7F7F7] p-4 rounded-2xl w-full h-full flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="h-6 bg-gray-300 rounded w-1/3 animate-pulse"></div>
          <div className="h-6 bg-gray-300 rounded w-1/6 animate-pulse"></div>
        </div>
        <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F7F7] p-4 rounded-2xl w-full h-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">
          Transaction History 
          {planId && <span className="text-xs text-gray-500 ml-2">(Plan Specific)</span>}
        </h3>
        <div className="flex items-center gap-2">
          {totalCount > 0 && (
            <span className="text-xs text-gray-500">
              {transactions.length} {planId ? 'plan' : 'recent'} transactions
            </span>
          )}
        </div>
      </div>

      {error ? (
        <div className="w-full h-full flex items-center justify-center flex-1">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="bg-white p-4 rounded-full">
              <PiEmptyBold className="text-red-500 inline-block" size={32} />
            </div>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => fetchTransactions()}
              className="text-primary text-sm hover:underline"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center flex-1">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-white p-4 rounded-full">
              <PiEmptyBold className="text-[#455A64] inline-block" size={32} />
            </div>
            <p className="text-gray-600">
              {planId ? 'No transactions for this plan yet' : 'No transactions yet'}
            </p>
            <p className="text-xs text-gray-500">
              {planId ? 'Transactions for this plan will appear here' : 'Your transactions will appear here'}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-3 flex-1">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="bg-white p-3 rounded-lg flex justify-between items-center hover:shadow-sm transition-shadow">
                <div className="flex-1">
                  <p className="font-medium capitalize">
                    {formatTransactionType(transaction.type, transaction.intent)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600">
                      {formatDate(transaction.createdAt)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(transaction.status)} bg-opacity-10 ${transaction.status === 'SUCCESS' ? 'bg-green-100' : transaction.status === 'PENDING' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                      {transaction.status.toLowerCase()}
                    </span>
                  </div>
                  {transaction.bankAccount && (
                    <p className="text-xs text-gray-500 mt-1">
                      {transaction.bankAccount.accountNumber} • {transaction.bankAccount.accountName}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ₦{transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Ref: {transaction.reference.substring(0, 6)}...
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Show "View All" button if there are more transactions */}
          {totalCount > limit && (
            <div className="pt-2 border-t">
              <Link 
                href={planId ? `/dashboard/transaction-history?planId=${planId}` : '/dashboard/transaction-history'} 
                className="text-primary text-sm hover:underline block text-center"
              >
                View all {planId ? 'plan' : ''} transactions →
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}