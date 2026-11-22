import { Account, Category, Debt, Goal, Subscription, Transaction } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  // Expenses
  { id: 'cat-food', name: 'Oziq-ovqat va bozor', icon: 'ShoppingCart', color: '#10B981', type: 'expense', budgetLimit: 3000000 },
  { id: 'cat-cafe', name: 'Kafe va restoranlar', icon: 'Coffee', color: '#F59E0B', type: 'expense', budgetLimit: 1200000 },
  { id: 'cat-transport', name: 'Transport va yoqilg\'i', icon: 'Car', color: '#3B82F6', type: 'expense', budgetLimit: 800000 },
  { id: 'cat-home', name: 'Uy va kommunal', icon: 'Home', color: '#6366F1', type: 'expense', budgetLimit: 700000 },
  { id: 'cat-shopping', name: 'Kiyim va xaridlar', icon: 'Shirt', color: '#EC4899', type: 'expense', budgetLimit: 1500000 },
  { id: 'cat-health', name: 'Sog\'liq va dorixona', icon: 'HeartPulse', color: '#EF4444', type: 'expense', budgetLimit: 500000 },
  { id: 'cat-education', name: 'Ta\'lim va kurslar', icon: 'GraduationCap', color: '#06B6D4', type: 'expense', budgetLimit: 1000000 },
  { id: 'cat-entertainment', name: 'Dam olish va hordiq', icon: 'Gamepad2', color: '#8B5CF6', type: 'expense', budgetLimit: 600000 },
  { id: 'cat-bills', name: 'Aloqa va internet', icon: 'Wifi', color: '#64748B', type: 'expense', budgetLimit: 250000 },
  { id: 'cat-other-exp', name: 'Boshqa xarajatlar', icon: 'MoreHorizontal', color: '#71717A', type: 'expense' },

  // Income
  { id: 'cat-salary', name: 'Oylik maosh', icon: 'Banknote', color: '#10B981', type: 'income' },
  { id: 'cat-business', name: 'Biznes va loyihalar', icon: 'Briefcase', color: '#3B82F6', type: 'income' },
  { id: 'cat-invest', name: 'Investitsiyalar', icon: 'TrendingUp', color: '#6366F1', type: 'income' },
  { id: 'cat-gift', name: 'Sovg\'a va bonus', icon: 'Gift', color: '#F59E0B', type: 'income' },
  { id: 'cat-other-inc', name: 'Boshqa daromad', icon: 'PlusCircle', color: '#71717A', type: 'income' },
];

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'acc-card',
    name: 'Uzcard / Humo',
    type: 'card',
    balance: 7850000,
    currency: 'UZS',
    color: '#10B981',
    accountNumber: '**** 8492'
  },
  {
    id: 'acc-cash',
    name: 'Naqd pul',
    type: 'cash',
    balance: 1420000,
    currency: 'UZS',
    color: '#71717A'
  },
  {
    id: 'acc-usd',
    name: 'Visa Gold',
    type: 'card',
    balance: 620,
    currency: 'USD',
    color: '#3B82F6',
    accountNumber: '**** 4021'
  },
  {
    id: 'acc-savings',
    name: 'Jamg\'arma depozit',
    type: 'savings',
    balance: 12000000,
    currency: 'UZS',
    color: '#6366F1',
    accountNumber: 'Depozit 21%'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tr-1',
    type: 'income',
    amount: 9500000,
    currency: 'UZS',
    categoryId: 'cat-salary',
    accountId: 'acc-card',
    date: '2026-11-20',
    time: '10:00',
    description: 'Noyabr oyi maoshi'
  },
  {
    id: 'tr-2',
    type: 'expense',
    amount: 380000,
    currency: 'UZS',
    categoryId: 'cat-food',
    accountId: 'acc-card',
    date: '2026-11-20',
    time: '18:45',
    description: 'Korzinka supermarketi xaridi'
  },
  {
    id: 'tr-3',
    type: 'expense',
    amount: 145000,
    currency: 'UZS',
    categoryId: 'cat-cafe',
    accountId: 'acc-card',
    date: '2026-11-21',
    time: '13:20',
    description: 'Tushlik (Rayhon)'
  },
  {
    id: 'tr-4',
    type: 'expense',
    amount: 250000,
    currency: 'UZS',
    categoryId: 'cat-transport',
    accountId: 'acc-cash',
    date: '2026-11-21',
    time: '15:10',
    description: 'Avtomobilga benzin'
  },
  {
    id: 'tr-5',
    type: 'expense',
    amount: 180000,
    currency: 'UZS',
    categoryId: 'cat-bills',
    accountId: 'acc-card',
    date: '2026-11-21',
    time: '20:00',
    description: 'Uy interneti to\'lovi'
  },
  {
    id: 'tr-6',
    type: 'income',
    amount: 1500000,
    currency: 'UZS',
    categoryId: 'cat-business',
    accountId: 'acc-card',
    date: '2026-11-22',
    time: '11:30',
    description: 'Frilans loyiha to\'lovi'
  },
  {
    id: 'tr-7',
    type: 'expense',
    amount: 95000,
    currency: 'UZS',
    categoryId: 'cat-food',
    accountId: 'acc-cash',
    date: '2026-11-22',
    time: '12:15',
    description: 'Non va sabzavotlar'
  }
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-1',
    title: 'Yangi MacBook',
    targetAmount: 22000000,
    currentAmount: 14500000,
    currency: 'UZS',
    deadline: '2027-02-01',
    icon: 'Laptop',
    color: '#10B981'
  },
  {
    id: 'goal-2',
    title: 'Sayohat fondi',
    targetAmount: 18000000,
    currentAmount: 7200000,
    currency: 'UZS',
    deadline: '2027-05-15',
    icon: 'Plane',
    color: '#3B82F6'
  },
  {
    id: 'goal-3',
    title: 'Ehtiyot jamg\'armasi',
    targetAmount: 10000000,
    currentAmount: 4800000,
    currency: 'UZS',
    icon: 'ShieldCheck',
    color: '#6366F1'
  }
];

export const INITIAL_DEBTS: Debt[] = [
  {
    id: 'debt-1',
    type: 'lent',
    personName: 'Sardorbek',
    amount: 2000000,
    paidAmount: 800000,
    currency: 'UZS',
    date: '2026-11-05',
    dueDate: '2026-12-01',
    notes: 'Qarz berilgan',
    completed: false
  },
  {
    id: 'debt-2',
    type: 'borrowed',
    personName: 'Akrom aka',
    amount: 500000,
    paidAmount: 500000,
    currency: 'UZS',
    date: '2026-11-01',
    dueDate: '2026-11-15',
    notes: 'Ta\'mirlash uchun — yopilgan',
    completed: true
  }
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-1',
    name: 'Yandex Plus',
    amount: 24999,
    currency: 'UZS',
    frequency: 'monthly',
    nextBillingDate: '2026-12-05',
    categoryId: 'cat-bills',
    accountId: 'acc-card',
    active: true,
    icon: 'Music'
  },
  {
    id: 'sub-2',
    name: 'Fitnes Klub',
    amount: 450000,
    currency: 'UZS',
    frequency: 'monthly',
    nextBillingDate: '2026-12-01',
    categoryId: 'cat-entertainment',
    accountId: 'acc-card',
    active: true,
    icon: 'Dumbbell'
  },
  {
    id: 'sub-3',
    name: 'ChatGPT Plus',
    amount: 20,
    currency: 'USD',
    frequency: 'monthly',
    nextBillingDate: '2026-12-14',
    categoryId: 'cat-education',
    accountId: 'acc-usd',
    active: true,
    icon: 'Bot'
  }
];
