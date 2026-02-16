// app/dashboard/transaction-history/utils/transactionUtils.ts

export const formatTransactionType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'CREDIT': 'Credit',
    'DEBIT': 'Debit', 
  };
  return typeMap[type] || type;
};

export const formatIntent = (intent: string): string => {
  const intentMap: Record<string, string> = {
    'CREATE_PLAN': 'Create Investment Plan',
    'TOP_UP_PLAN': 'Top-up Investment',
    'ROI_PAYOUT': 'ROI Payout',
    'LIQUIDATION': 'Investment Liquidation',
    'ROLLOVER': 'Investment Rollover',
    'WITHDRAWAL': 'Withdrawal'
  };
  return intentMap[intent] || intent.replace(/_/g, ' ').toLowerCase();
};

export const formatCurrency = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG')}`;
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  
  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDate = (dateString: string, includeTime: boolean = false): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.hour12 = true;
  }
  
  return date.toLocaleDateString('en-NG', options);
};

export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'PENDING': 'Pending',
    'SUCCESS': 'Success',
    'FAILED': 'Failed'
  };
  return statusMap[status] || status;
};

export const getStatusClasses = (status: string): { bg: string; text: string; border: string } => {
  switch (status) {
    case 'SUCCESS':
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200'
      };
    case 'PENDING':
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200'
      };
    case 'FAILED':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200'
      };
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200'
      };
  }
};

export const getTypeIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    'PAYMENT': '💰',
    'TRANSFER': '🔄',
    'REFUND': '↩️',
    'CREATE_PLAN': '📈',
    'TOP_UP_PLAN': '⬆️',
    'ROI_PAYOUT': '💵',
    'WITHDRAWAL': '🏧'
  };
  return iconMap[type] || '📊';
};

export const validateFilters = (filters: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (filters.fromDate && filters.toDate) {
    const fromDate = new Date(filters.fromDate);
    const toDate = new Date(filters.toDate);
    
    if (fromDate > toDate) {
      errors.push('Start date cannot be after end date');
    }
    
    const diffDays = Math.floor((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 365) {
      errors.push('Date range cannot exceed 1 year');
    }
  }
  
  if (filters.amount && (isNaN(Number(filters.amount)) || Number(filters.amount) < 0)) {
    errors.push('Amount must be a positive number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const parseFiltersFromURL = (searchParams: URLSearchParams): any => {
  const filters: any = {};
  
  const validKeys = [
    'page', 'limit', 'amount', 'type', 'intent', 'gatewayType',
    'status', 'reference', 'planId', 'fromDate', 'toDate'
  ];
  
  validKeys.forEach(key => {
    const value = searchParams.get(key);
    if (value !== null) {
      if (['page', 'limit', 'amount'].includes(key)) {
        filters[key] = Number(value);
      } else {
        filters[key] = value;
      }
    }
  });
  
  return filters;
};

export const groupTransactionsByDate = (transactions: any[]): Record<string, any[]> => {
  const groups: Record<string, any[]> = {};
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let dateKey: string;
    
    if (date.toDateString() === today.toDateString()) {
      dateKey = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = 'Yesterday';
    } else {
      dateKey = date.toLocaleDateString('en-NG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    
    groups[dateKey].push(transaction);
  });
  
  return groups;
};

export const calculateStats = (transactions: any[]) => {
  let totalAmount = 0;
  let successAmount = 0;
  let pendingAmount = 0;
  let failedAmount = 0;
  
  const counts = {
    total: transactions.length,
    success: 0,
    pending: 0,
    failed: 0
  };
  
  transactions.forEach(transaction => {
    totalAmount += transaction.amount;
    
    switch (transaction.status) {
      case 'SUCCESS':
        counts.success++;
        successAmount += transaction.amount;
        break;
      case 'PENDING':
        counts.pending++;
        pendingAmount += transaction.amount;
        break;
      case 'FAILED':
        counts.failed++;
        failedAmount += transaction.amount;
        break;
    }
  });
  
  return {
    counts,
    amounts: {
      total: totalAmount,
      success: successAmount,
      pending: pendingAmount,
      failed: failedAmount
    },
    averages: {
      transaction: transactions.length > 0 ? totalAmount / transactions.length : 0
    }
  };
};

// Fixed CSV generation function with proper types
export const generateCSVData = (transactions: any[]): string => {
  // Define CSV header row
  const headers = [
    'Date',
    'Reference',
    'Type',
    'Intent',
    'Amount (₦)',
    'Status',
    'Gateway Fee (₦)',
    'User',
    'Bank Account',
    'Plan ID',
    'Created At'
  ];
  
  // Function to escape CSV cells properly
  const escapeCSV = (value: any): string => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    // Escape double quotes by doubling them
    const escapedValue = stringValue.replace(/"/g, '""');
    // Wrap in quotes if contains comma, newline, or quote
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${escapedValue}"`;
    }
    return escapedValue;
  };
  
  // Build CSV rows
  const rows = transactions.map(transaction => {
    const row = [
      formatDate(transaction.createdAt),
      transaction.reference,
      formatTransactionType(transaction.direction),
      formatIntent(transaction.intent),
      transaction.amount,
      getStatusText(transaction.status),
      transaction.gatewayFee,
      `${transaction.user.firstName} ${transaction.user.lastName}`,
      transaction.bankAccount ? 
        `${transaction.bankAccount.accountNumber} - ${transaction.bankAccount.accountName}` : 
        'N/A',
      transaction.planId || 'N/A',
      transaction.createdAt
    ];
    return row;
  });
  
  // Build CSV content
  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n');
  
  return csvContent;
};

export const filterTransactionsBySearch = (
  transactions: any[],
  searchTerm: string
): any[] => {
  if (!searchTerm.trim()) return transactions;
  
  const term = searchTerm.toLowerCase();
  
  return transactions.filter(transaction => {
    return (
      transaction.reference.toLowerCase().includes(term) ||
      (transaction.user?.firstName?.toLowerCase().includes(term) || false) ||
      (transaction.user?.lastName?.toLowerCase().includes(term) || false) ||
      transaction.user?.email?.toLowerCase().includes(term) ||
      (transaction.bankAccount?.accountNumber?.includes(term) || false) ||
      (transaction.bankAccount?.accountName?.toLowerCase().includes(term) || false) ||
      transaction.amount.toString().includes(term) ||
      transaction.type.toLowerCase().includes(term) ||
      transaction.intent.toLowerCase().includes(term)
    );
  });
};

export const sortTransactions = (
  transactions: any[],
  field: string,
  direction: 'asc' | 'desc' = 'asc'
): any[] => {
  return [...transactions].sort((a, b) => {
    let aValue = a[field];
    let bValue = b[field];
    
    if (field === 'user.name') {
      aValue = `${a.user.firstName} ${a.user.lastName}`;
      bValue = `${b.user.firstName} ${b.user.lastName}`;
    } else if (field === 'bankAccount.accountNumber') {
      aValue = a.bankAccount?.accountNumber || '';
      bValue = b.bankAccount?.accountNumber || '';
    }
    
    if (field.includes('createdAt') || field.includes('updatedAt') || field.includes('date')) {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    if (field === 'amount' || field === 'gatewayFee') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }
    
    if (direction === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });
};

// Export all functions
export default {
  formatTransactionType,
  formatIntent,
  formatCurrency,
  formatRelativeTime,
  formatDate,
  getStatusText,
  getStatusClasses,
  getTypeIcon,
  validateFilters,
  parseFiltersFromURL,
  groupTransactionsByDate,
  calculateStats,
  generateCSVData,
  filterTransactionsBySearch,
  sortTransactions
};