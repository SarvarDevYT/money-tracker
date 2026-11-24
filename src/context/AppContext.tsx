import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Transaction, 
  Category, 
  Account, 
  Goal, 
  Debt, 
  Subscription, 
  FilterState, 
  CurrencyType 
} from '../types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_ACCOUNTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_GOALS, 
  INITIAL_DEBTS, 
  INITIAL_SUBSCRIPTIONS 
} from '../constants/initialData';
import { convertToUZS, downloadCSV } from '../utils/formatters';

interface AppContextType {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  goals: Goal[];
  debts: Debt[];
  subscriptions: Subscription[];
  hideBalance: boolean;
  setHideBalance: (val: boolean | ((prev: boolean) => boolean)) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;

  // Actions
  addTransaction: (data: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  editTransaction: (transaction: Transaction) => void;

  addCategory: (category: Omit<Category, 'id'>) => void;
  editCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;

  addAccount: (account: Omit<Account, 'id'>) => void;
  editAccount: (account: Account) => void;
  setAccountBalance: (accountId: string, newBalance: number) => void;
  deleteAccount: (id: string) => void;
  transferFunds: (fromAccountId: string, toAccountId: string, amount: number, note?: string) => void;

  addGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => void;
  contributeToGoal: (goalId: string, amount: number, fromAccountId?: string) => void;
  deleteGoal: (id: string) => void;

  addDebt: (debt: Omit<Debt, 'id' | 'paidAmount' | 'completed'>) => void;
  payDebt: (debtId: string, amount: number, accountId?: string) => void;
  deleteDebt: (id: string) => void;

  addSubscription: (sub: Omit<Subscription, 'id' | 'active'>) => void;
  toggleSubscription: (id: string) => void;
  deleteSubscription: (id: string) => void;

  // Global utilities
  totalBalanceInUZS: number;
  totalIncomeThisMonth: number;
  totalExpenseThisMonth: number;
  clearAllData: () => void;
  exportJSON: () => void;
  importJSON: (jsonString: string) => boolean;
  exportCSV: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Clean storage key for real zero-state production
const STORAGE_KEY = 'money_tracker_live_v3';

// One-time cleanup of any older demo versions from user's browser
try {
  ['money_tracker_pro_v1', 'money_tracker_pro_v2', 'money_tracker_data_v1'].forEach(prefix => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
  });
} catch (_) {}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_transactions`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_categories`);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_accounts`);
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_goals`);
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [debts, setDebts] = useState<Debt[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_debts`);
    return saved ? JSON.parse(saved) : INITIAL_DEBTS;
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_subscriptions`);
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  const [hideBalance, setHideBalance] = useState<boolean>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_hideBalance`) === 'true';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [filterState, setFilterState] = useState<FilterState>({
    timeRange: 'month',
    type: 'all'
  });

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_transactions`, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_categories`, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_accounts`, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_goals`, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_debts`, JSON.stringify(debts));
  }, [debts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_subscriptions`, JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_hideBalance`, String(hideBalance));
  }, [hideBalance]);

  // Calculations
  const totalBalanceInUZS = accounts.reduce((acc, a) => acc + convertToUZS(a.balance, a.currency), 0);

  const currentYearMonth = new Date().toISOString().slice(0, 7);
  
  const thisMonthTransactions = transactions.filter(t => t.date.startsWith(currentYearMonth));
  const totalIncomeThisMonth = thisMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + convertToUZS(t.amount, t.currency), 0);

  const totalExpenseThisMonth = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + convertToUZS(t.amount, t.currency), 0);

  // Add Transaction
  const addTransaction = (data: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...data,
      id: `tr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    };

    setTransactions(prev => [newTx, ...prev]);

    // Update account balance
    setAccounts(prev => prev.map(acc => {
      if (acc.id === data.accountId) {
        const delta = data.type === 'income' ? data.amount : -data.amount;
        return { ...acc, balance: acc.balance + delta };
      }
      return acc;
    }));
  };

  // Delete Transaction
  const deleteTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    if (tx.type === 'transfer' && tx.toAccountId) {
      // Revert transfer: refund fromAccount, deduct toAccount
      setAccounts(prev => {
        const fromAcc = prev.find(a => a.id === tx.accountId);
        const toAcc = prev.find(a => a.id === tx.toAccountId);
        let convertedAmount = tx.amount;
        if (fromAcc && toAcc && fromAcc.currency !== toAcc.currency) {
          const uzsAmount = convertToUZS(tx.amount, fromAcc.currency);
          if (toAcc.currency === 'USD') convertedAmount = uzsAmount / 12850;
          else if (toAcc.currency === 'RUB') convertedAmount = uzsAmount / 135;
          else convertedAmount = uzsAmount;
        }

        return prev.map(acc => {
          if (acc.id === tx.accountId) {
            return { ...acc, balance: acc.balance + tx.amount };
          }
          if (acc.id === tx.toAccountId) {
            return { ...acc, balance: acc.balance - convertedAmount };
          }
          return acc;
        });
      });
    } else {
      setAccounts(prev => prev.map(acc => {
        if (acc.id === tx.accountId) {
          const reverseDelta = tx.type === 'income' ? -tx.amount : tx.amount;
          return { ...acc, balance: acc.balance + reverseDelta };
        }
        return acc;
      }));
    }

    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Edit Transaction
  const editTransaction = (updatedTx: Transaction) => {
    const oldTx = transactions.find(t => t.id === updatedTx.id);
    if (!oldTx) return;

    setAccounts(prev => prev.map(acc => {
      let balance = acc.balance;
      if (acc.id === oldTx.accountId) {
        balance += oldTx.type === 'income' ? -oldTx.amount : oldTx.amount;
      }
      if (acc.id === updatedTx.accountId) {
        balance += updatedTx.type === 'income' ? updatedTx.amount : -updatedTx.amount;
      }
      return { ...acc, balance };
    }));

    setTransactions(prev => prev.map(t => t.id === updatedTx.id ? updatedTx : t));
  };

  // Categories CRUD
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...category,
      id: `cat-${Date.now()}`
    };
    setCategories(prev => [...prev, newCat]);
  };

  const editCategory = (updatedCat: Category) => {
    setCategories(prev => prev.map(c => c.id === updatedCat.id ? updatedCat : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Accounts CRUD
  const addAccount = (account: Omit<Account, 'id'>) => {
    const newAcc: Account = {
      ...account,
      id: `acc-${Date.now()}`
    };
    setAccounts(prev => [...prev, newAcc]);
  };

  const editAccount = (updatedAcc: Account) => {
    setAccounts(prev => prev.map(a => a.id === updatedAcc.id ? updatedAcc : a));
  };

  const setAccountBalance = (accountId: string, newBalance: number) => {
    setAccounts(prev => prev.map(a => a.id === accountId ? { ...a, balance: newBalance } : a));
  };

  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  const transferFunds = (fromAccountId: string, toAccountId: string, amount: number, note?: string) => {
    const fromAcc = accounts.find(a => a.id === fromAccountId);
    const toAcc = accounts.find(a => a.id === toAccountId);
    if (!fromAcc || !toAcc || amount <= 0) return;

    setAccounts(prev => prev.map(a => {
      if (a.id === fromAccountId) return { ...a, balance: a.balance - amount };
      if (a.id === toAccountId) {
        let convertedAmount = amount;
        if (fromAcc.currency !== toAcc.currency) {
          const uzsAmount = convertToUZS(amount, fromAcc.currency);
          if (toAcc.currency === 'USD') convertedAmount = uzsAmount / 12850;
          else if (toAcc.currency === 'RUB') convertedAmount = uzsAmount / 135;
          else convertedAmount = uzsAmount;
        }
        return { ...a, balance: a.balance + convertedAmount };
      }
      return a;
    }));

    const now = new Date();
    const transferTx: Transaction = {
      id: `tr-transfer-${Date.now()}`,
      type: 'transfer',
      amount,
      currency: fromAcc.currency,
      categoryId: 'cat-other-exp',
      accountId: fromAccountId,
      toAccountId: toAccountId,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      description: `O'tkazma: ${fromAcc.name} ➔ ${toAcc.name}${note ? ` (${note})` : ''}`
    };
    setTransactions(prev => [transferTx, ...prev]);
  };

  // Goals CRUD
  const addGoal = (goal: Omit<Goal, 'id' | 'currentAmount'>) => {
    const newGoal: Goal = {
      ...goal,
      currentAmount: 0,
      id: `goal-${Date.now()}`
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const contributeToGoal = (goalId: string, amount: number, fromAccountId?: string) => {
    if (amount <= 0) return;
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return { ...g, currentAmount: g.currentAmount + amount };
      }
      return g;
    }));

    if (fromAccountId) {
      setAccounts(prev => prev.map(a => {
        if (a.id === fromAccountId) {
          return { ...a, balance: a.balance - amount };
        }
        return a;
      }));
    }
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Debts CRUD
  const addDebt = (debt: Omit<Debt, 'id' | 'paidAmount' | 'completed'>) => {
    const newDebt: Debt = {
      ...debt,
      paidAmount: 0,
      completed: false,
      id: `debt-${Date.now()}`
    };
    setDebts(prev => [newDebt, ...prev]);
  };

  const payDebt = (debtId: string, amount: number, accountId?: string) => {
    const targetDebt = debts.find(d => d.id === debtId);
    if (!targetDebt) return;

    const newPaid = Math.min(targetDebt.amount, targetDebt.paidAmount + amount);
    const isCompleted = newPaid >= targetDebt.amount;

    setDebts(prev => prev.map(d => {
      if (d.id === debtId) {
        return { ...d, paidAmount: newPaid, completed: isCompleted };
      }
      return d;
    }));

    if (accountId) {
      setAccounts(prev => prev.map(a => {
        if (a.id === accountId) {
          const delta = targetDebt.type === 'borrowed' ? -amount : amount;
          return { ...a, balance: a.balance + delta };
        }
        return a;
      }));
    }
  };

  const deleteDebt = (id: string) => {
    setDebts(prev => prev.filter(d => d.id !== id));
  };

  // Subscriptions CRUD
  const addSubscription = (sub: Omit<Subscription, 'id' | 'active'>) => {
    const newSub: Subscription = {
      ...sub,
      active: true,
      id: `sub-${Date.now()}`
    };
    setSubscriptions(prev => [...prev, newSub]);
  };

  const toggleSubscription = (id: string) => {
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
  };

  // Clear all data to 0 (Real use)
  const clearAllData = () => {
    if (window.confirm("Rostdan ham barcha ma'lumotlarni tozalab, hammasini 0 holatiga keltirmoqchimisiz?")) {
      setTransactions([]);
      setGoals([]);
      setDebts([]);
      setSubscriptions([]);
      setAccounts(prev => prev.map(a => ({ ...a, balance: 0 })));
      setCategories(INITIAL_CATEGORIES);
    }
  };

  // Export JSON
  const exportJSON = () => {
    const data = {
      transactions,
      categories,
      accounts,
      goals,
      debts,
      subscriptions,
      exportDate: new Date().toISOString()
    };
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonStr);
    downloadAnchor.setAttribute("download", `money_tracker_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const importJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.transactions && Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
        if (data.categories) setCategories(data.categories);
        if (data.accounts) setAccounts(data.accounts);
        if (data.goals) setGoals(data.goals);
        if (data.debts) setDebts(data.debts);
        if (data.subscriptions) setSubscriptions(data.subscriptions);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Import error:", e);
      return false;
    }
  };

  // Export CSV
  const exportCSV = () => {
    const headers = "ID,Turi,Summa,Valyuta,Kategoriya,Hisob,Sana,Vaqt,Izoh\n";
    const rows = transactions.map(t => {
      const cat = categories.find(c => c.id === t.categoryId)?.name || t.categoryId;
      const acc = accounts.find(a => a.id === t.accountId)?.name || t.accountId;
      const typeText = t.type === 'income' ? 'Daromad' : t.type === 'transfer' ? "O'tkazma" : 'Xarajat';
      const cleanDesc = (t.description || '').replace(/"/g, '""');
      return `"${t.id}","${typeText}",${t.amount},"${t.currency}","${cat}","${acc}","${t.date}","${t.time}","${cleanDesc}"`;
    }).join("\n");

    downloadCSV(headers + rows, `tranzaksiyalar_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        categories,
        accounts,
        goals,
        debts,
        subscriptions,
        hideBalance,
        setHideBalance,
        activeTab,
        setActiveTab,
        filterState,
        setFilterState,
        addTransaction,
        deleteTransaction,
        editTransaction,
        addCategory,
        editCategory,
        deleteCategory,
        addAccount,
        editAccount,
        setAccountBalance,
        deleteAccount,
        transferFunds,
        addGoal,
        contributeToGoal,
        deleteGoal,
        addDebt,
        payDebt,
        deleteDebt,
        addSubscription,
        toggleSubscription,
        deleteSubscription,
        totalBalanceInUZS,
        totalIncomeThisMonth,
        totalExpenseThisMonth,
        clearAllData,
        exportJSON,
        importJSON,
        exportCSV,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
