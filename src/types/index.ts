export type TransactionType = 'expense' | 'income' | 'transfer';

export type CurrencyType = 'UZS' | 'USD' | 'RUB';

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  color: string;
  type: TransactionType;
  budgetLimit?: number; // Monthly budget limit in primary currency
}

export interface Account {
  id: string;
  name: string;
  type: 'card' | 'cash' | 'bank' | 'savings' | 'investment';
  balance: number;
  currency: CurrencyType;
  color: string;
  accountNumber?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: CurrencyType;
  categoryId: string;
  accountId: string;
  toAccountId?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  description?: string;
  tag?: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  currency: CurrencyType;
  deadline?: string;
  icon: string;
  color: string;
  category?: string;
}

export interface Debt {
  id: string;
  type: 'borrowed' | 'lent'; // 'borrowed' = men qarz oldim, 'lent' = men qarz berdim
  personName: string;
  amount: number;
  paidAmount: number;
  currency: CurrencyType;
  dueDate?: string;
  date: string;
  notes?: string;
  completed: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: CurrencyType;
  frequency: 'monthly' | 'yearly' | 'weekly';
  nextBillingDate: string;
  categoryId: string;
  accountId: string;
  active: boolean;
  icon?: string;
}

export type TimeRangeFilter = 'today' | 'week' | 'month' | 'year' | 'all' | 'custom';

export interface FilterState {
  timeRange: TimeRangeFilter;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  accountId?: string;
  type?: 'all' | 'expense' | 'income';
  searchQuery?: string;
}
