// app/dashboard/transaction-history/components/TransactionTable.tsx
"use client";

import { useState } from "react";
import { IoEye, IoCopy } from "react-icons/io5";

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

type TransactionTableProps = {
  transactions: Transaction[];
};

const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const formatIntent = (intent: string) => {
    const intentMap: Record<string, string> = {
      'CREATE_PLAN': 'Create Plan',
      'TOP_UP_PLAN': 'Top-up Plan',
      'ROI_PAYOUT': 'ROI Payout',
      'LIQUIDATION': 'Liquidation',
      'ROLLOVER': 'Rollover',
      'WITHDRAWAL': 'Withdrawal',
    };
    return intentMap[intent] || intent;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleRowExpand = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <>
      {/* Mobile View - Card Layout */}
      <div className="block sm:hidden">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">
                  {transaction.type} • {formatIntent(transaction.intent)}
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                {transaction.status}
              </span>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <div className="text-lg font-semibold text-gray-900">
                ₦{transaction.amount.toLocaleString()}
              </div>
              <button
                onClick={() => toggleRowExpand(transaction.id)}
                className="text-primary hover:text-primary-dark flex items-center gap-1 text-sm"
              >
                <IoEye />
                {expandedRow === transaction.id ? 'Less' : 'Details'}
              </button>
            </div>

            {/* Expanded Details for Mobile */}
            {expandedRow === transaction.id && (
              <div className="mt-3 pt-3 border-t border-gray-100 text-sm space-y-2">
                <div>
                  <span className="text-gray-500">Reference: </span>
                  <span className="font-mono text-xs">{transaction.reference}</span>
                </div>
                <div>
                  <span className="text-gray-500">User: </span>
                  <span>{transaction.user.firstName} {transaction.user.lastName}</span>
                </div>
                {transaction.gatewayFee > 0 && (
                  <div>
                    <span className="text-gray-500">Fee: </span>
                    <span>₦{transaction.gatewayFee.toLocaleString()}</span>
                  </div>
                )}
                {transaction.bankAccount && (
                  <div>
                    <span className="text-gray-500">Account: </span>
                    <span>{transaction.bankAccount.accountNumber}</span>
                  </div>
                )}
                <button
                  onClick={() => setSelectedTransaction(transaction)}
                  className="mt-2 w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-center"
                >
                  View Full Details
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Reference
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type 
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    {/* <span className="truncate max-w-[120px]">{transaction.reference}</span> */}
                    {/* <button
                      onClick={() => copyToClipboard(transaction.reference)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Copy reference"
                    >
                      <IoCopy size={14} />
                    </button> */}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {transaction.type}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatIntent(transaction.intent)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-lg font-semibold text-gray-900">
                    ₦{transaction.amount.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedTransaction(transaction)}
                    className="text-primary hover:text-primary-dark flex items-center gap-1"
                  >
                    <IoEye />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transaction Details Modal - Make responsive */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold">Transaction Details</h3>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Grid - Stack on mobile, 2 columns on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="col-span-1 sm:col-span-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-500">Reference</label>
                    <p className="font-mono text-xs sm:text-sm break-all">{selectedTransaction.reference}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTransaction.status)}`}>
                        {selectedTransaction.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500">Type / Intent</label>
                    <p className="text-sm">{selectedTransaction.type} • {formatIntent(selectedTransaction.intent)}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500">Amount</label>
                    <p className="text-lg sm:text-xl font-bold">₦{selectedTransaction.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500">Gateway Fee</label>
                    <p className="text-sm">₦{selectedTransaction.gatewayFee.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium text-sm sm:text-base mb-2">Timestamps</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Created</label>
                      <p className="text-sm">{new Date(selectedTransaction.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Updated</label>
                      <p className="text-sm">{new Date(selectedTransaction.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium text-sm sm:text-base mb-2">User Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Name</label>
                      <p className="text-sm">{selectedTransaction.user.firstName} {selectedTransaction.user.lastName}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Email</label>
                      <p className="text-sm break-all">{selectedTransaction.user.email}</p>
                    </div>
                  </div>
                </div>
                
                {selectedTransaction.bankAccount && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-sm sm:text-base mb-2">Bank Account</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="col-span-1 sm:col-span-2">
                        <label className="text-xs text-gray-500">Account Name</label>
                        <p className="text-sm">{selectedTransaction.bankAccount.accountName}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Account Number</label>
                        <p className="text-sm">{selectedTransaction.bankAccount.accountNumber}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedTransaction.metadata && Object.keys(selectedTransaction.metadata).length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-sm sm:text-base mb-2">Additional Data</h4>
                    <pre className="bg-gray-50 p-3 rounded-lg overflow-x-auto text-xs">
                      {JSON.stringify(selectedTransaction.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionTable;