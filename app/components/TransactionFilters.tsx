// app/dashboard/transaction-history/components/TransactionFilters.tsx
"use client";

import { useState } from "react";

type Filters = {
  amount?: number;
  type: string;
  intent: string;
  gatewayType: string;
  status: string;
  reference: string;
  planId: string;
  fromDate: string;
  toDate: string;
};

type TransactionFiltersProps = {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  onClearFilters: () => void;
};

const TransactionFilters = ({ filters, onFilterChange, onClearFilters }: TransactionFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);
  
  const handleApply = () => {
    onFilterChange(localFilters);
  };
  
  const handleReset = () => {
    const resetFilters: Filters = {
      amount: undefined,
      type: "",
      intent: "",
      gatewayType: "",
      status: "",
      reference: "",
      planId: "",
      fromDate: "",
      toDate: ""
    };
    setLocalFilters(resetFilters);
    onClearFilters();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Filter Transactions</h3>
        <button
          onClick={handleReset}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Clear All Filters
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            value={localFilters.amount || ""}
            onChange={(e) => setLocalFilters({ ...localFilters, amount: e.target.value ? Number(e.target.value) : undefined })}
            placeholder="Filter by amount"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={localFilters.type}
            onChange={(e) => setLocalFilters({ ...localFilters, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="PAYMENT">Payment</option>
            <option value="TRANSFER">Transfer</option>
            <option value="REFUND">Refund</option>
          </select>
        </div>
        
        {/* Intent */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Intent
          </label>
          <select
            value={localFilters.intent}
            onChange={(e) => setLocalFilters({ ...localFilters, intent: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Intents</option>
            <option value="CREATE_PLAN">Create Plan</option>
            <option value="TOP_UP_PLAN">Top-up Plan</option>
            <option value="ROI_PAYOUT">ROI Payout</option>
            <option value="LIQUIDATION">Liquidation</option>
            <option value="ROLLOVER">Rollover</option>
            <option value="WITHDRAWAL">Withdrawal</option>
          </select>
        </div>
        
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={localFilters.status}
            onChange={(e) => setLocalFilters({ ...localFilters, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
        
        {/* Date Range */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={localFilters.fromDate}
              onChange={(e) => setLocalFilters({ ...localFilters, fromDate: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <span className="self-center">to</span>
            <input
              type="date"
              value={localFilters.toDate}
              onChange={(e) => setLocalFilters({ ...localFilters, toDate: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Plan ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plan ID
          </label>
          <input
            type="text"
            value={localFilters.planId}
            onChange={(e) => setLocalFilters({ ...localFilters, planId: e.target.value })}
            placeholder="Filter by plan ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default TransactionFilters;