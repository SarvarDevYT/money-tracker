import { Account, Category, Debt, Goal, Subscription, Transaction } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  // Expenses
  { id: 'cat-food', name: 'Oziq-ovqat va bozor', icon: 'ShoppingCart', color: '#10B981', type: 'expense' },
  { id: 'cat-cafe', name: 'Kafe va restoranlar', icon: 'Coffee', color: '#F59E0B', type: 'expense' },
  { id: 'cat-transport', name: 'Transport va yoqilg\'i', icon: 'Car', color: '#3B82F6', type: 'expense' },
  { id: 'cat-home', name: 'Uy va kommunal', icon: 'Home', color: '#6366F1', type: 'expense' },
  { id: 'cat-shopping', name: 'Kiyim va xaridlar', icon: 'Shirt', color: '#EC4899', type: 'expense' },
  { id: 'cat-health', name: 'Sog\'liq va dorixona', icon: 'HeartPulse', color: '#EF4444', type: 'expense' },
  { id: 'cat-education', name: 'Ta\'lim va kurslar', icon: 'GraduationCap', color: '#06B6D4', type: 'expense' },
  { id: 'cat-entertainment', name: 'Dam olish va hordiq', icon: 'Gamepad2', color: '#8B5CF6', type: 'expense' },
  { id: 'cat-bills', name: 'Aloqa va internet', icon: 'Wifi', color: '#64748B', type: 'expense' },
  { id: 'cat-other-exp', name: 'Boshqa xarajatlar', icon: 'MoreHorizontal', color: '#71717A', type: 'expense' },

  // Income
  { id: 'cat-salary', name: 'Oylik maosh', icon: 'Banknote', color: '#10B981', type: 'income' },
  { id: 'cat-business', name: 'Biznes va savdo', icon: 'Briefcase', color: '#3B82F6', type: 'income' },
  { id: 'cat-freelance', name: 'Frilans va xizmatlar', icon: 'TrendingUp', color: '#6366F1', type: 'income' },
  { id: 'cat-gift', name: 'Sovg\'a va bonus', icon: 'Gift', color: '#F59E0B', type: 'income' },
  { id: 'cat-initial', name: 'Boshlang\'ich qoldiq', icon: 'PlusCircle', color: '#10B981', type: 'income' },
  { id: 'cat-other-inc', name: 'Boshqa daromad', icon: 'PlusCircle', color: '#71717A', type: 'income' },
];

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'acc-card',
    name: 'Bank kartasi',
    type: 'card',
    balance: 0,
    currency: 'UZS',
    color: '#10B981',
    accountNumber: 'Asosiy karta'
  },
  {
    id: 'acc-cash',
    name: 'Naqd pul',
    type: 'cash',
    balance: 0,
    currency: 'UZS',
    color: '#71717A'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const INITIAL_GOALS: Goal[] = [];

export const INITIAL_DEBTS: Debt[] = [];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [];
