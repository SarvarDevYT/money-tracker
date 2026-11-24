import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { 
  Transaction, 
  Category, 
  Account, 
  Goal, 
  Debt, 
  Subscription, 
  FilterState 
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
  user: User | null;
  authLoading: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  signOut: () => Promise<void>;
  isCloudSyncing: boolean;

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

const STORAGE_KEY = 'money_tracker_live_v3';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

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

  // Local storage persistence (always keeps an offline backup)
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

  // Auth session listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    }).catch(() => {
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch or migrate cloud data when user changes
  useEffect(() => {
    if (!user) return;

    const syncCloud = async () => {
      setIsCloudSyncing(true);
      try {
        const [
          { data: cAccounts },
          { data: cCategories },
          { data: cTransactions },
          { data: cGoals },
          { data: cDebts },
          { data: cSubs }
        ] = await Promise.all([
          supabase.from('accounts').select('*').eq('user_id', user.id),
          supabase.from('categories').select('*').eq('user_id', user.id),
          supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: false }),
          supabase.from('goals').select('*').eq('user_id', user.id),
          supabase.from('debts').select('*').eq('user_id', user.id),
          supabase.from('subscriptions').select('*').eq('user_id', user.id)
        ]);

        if (cAccounts && cAccounts.length > 0) {
          // Cloud has existing data -> use cloud as source of truth
          setAccounts(cAccounts.map(a => ({
            id: a.id,
            name: a.name,
            type: a.type,
            balance: Number(a.balance),
            currency: a.currency,
            color: a.color,
            accountNumber: a.account_number
          })));

          if (cCategories && cCategories.length > 0) {
            setCategories(cCategories.map(c => ({
              id: c.id,
              name: c.name,
              icon: c.icon,
              color: c.color,
              type: c.type,
              budgetLimit: c.budget_limit ? Number(c.budget_limit) : undefined
            })));
          }

          if (cTransactions) {
            setTransactions(cTransactions.map(t => ({
              id: t.id,
              type: t.type,
              amount: Number(t.amount),
              currency: t.currency,
              categoryId: t.category_id,
              accountId: t.account_id,
              toAccountId: t.to_account_id,
              date: t.date,
              time: t.time,
              description: t.description,
              tag: t.tag
            })));
          }

          if (cGoals) {
            setGoals(cGoals.map(g => ({
              id: g.id,
              title: g.title,
              targetAmount: Number(g.target_amount),
              currentAmount: Number(g.current_amount),
              currency: g.currency,
              deadline: g.deadline,
              icon: g.icon,
              color: g.color,
              category: g.category
            })));
          }

          if (cDebts) {
            setDebts(cDebts.map(d => ({
              id: d.id,
              type: d.type,
              personName: d.person_name,
              amount: Number(d.amount),
              paidAmount: Number(d.paid_amount),
              currency: d.currency,
              dueDate: d.due_date,
              date: d.date,
              notes: d.notes,
              completed: d.completed
            })));
          }

          if (cSubs) {
            setSubscriptions(cSubs.map(s => ({
              id: s.id,
              name: s.name,
              amount: Number(s.amount),
              currency: s.currency,
              frequency: s.frequency,
              nextBillingDate: s.next_billing_date,
              categoryId: s.category_id,
              accountId: s.account_id,
              active: s.active,
              icon: s.icon
            })));
          }
        } else {
          // Cloud is empty for this new user -> migrate local data to cloud
          if (accounts.length > 0) {
            await supabase.from('accounts').insert(accounts.map(a => ({
              id: a.id,
              user_id: user.id,
              name: a.name,
              type: a.type,
              balance: a.balance,
              currency: a.currency,
              color: a.color,
              account_number: a.accountNumber
            })));
          }
          if (categories.length > 0) {
            await supabase.from('categories').insert(categories.map(c => ({
              id: c.id,
              user_id: user.id,
              name: c.name,
              icon: c.icon,
              color: c.color,
              type: c.type,
              budget_limit: c.budgetLimit
            })));
          }
          if (transactions.length > 0) {
            await supabase.from('transactions').insert(transactions.map(t => ({
              id: t.id,
              user_id: user.id,
              type: t.type,
              amount: t.amount,
              currency: t.currency,
              category_id: t.categoryId,
              account_id: t.accountId,
              to_account_id: t.toAccountId,
              date: t.date,
              time: t.time,
              description: t.description,
              tag: t.tag
            })));
          }
        }
      } catch (err) {
        console.error("Cloud sync error:", err);
      } finally {
        setIsCloudSyncing(false);
      }
    };

    syncCloud();
  }, [user?.id]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

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
        const updatedBalance = acc.balance + delta;
        if (user) {
          supabase.from('accounts').update({ balance: updatedBalance }).eq('id', acc.id);
        }
        return { ...acc, balance: updatedBalance };
      }
      return acc;
    }));

    if (user) {
      supabase.from('transactions').insert({
        id: newTx.id,
        user_id: user.id,
        type: newTx.type,
        amount: newTx.amount,
        currency: newTx.currency,
        category_id: newTx.categoryId,
        account_id: newTx.accountId,
        to_account_id: newTx.toAccountId,
        date: newTx.date,
        time: newTx.time,
        description: newTx.description,
        tag: newTx.tag
      });
    }
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
            const newBal = acc.balance + tx.amount;
            if (user) supabase.from('accounts').update({ balance: newBal }).eq('id', acc.id);
            return { ...acc, balance: newBal };
          }
          if (acc.id === tx.toAccountId) {
            const newBal = acc.balance - convertedAmount;
            if (user) supabase.from('accounts').update({ balance: newBal }).eq('id', acc.id);
            return { ...acc, balance: newBal };
          }
          return acc;
        });
      });
    } else {
      setAccounts(prev => prev.map(acc => {
        if (acc.id === tx.accountId) {
          const reverseDelta = tx.type === 'income' ? -tx.amount : tx.amount;
          const newBal = acc.balance + reverseDelta;
          if (user) supabase.from('accounts').update({ balance: newBal }).eq('id', acc.id);
          return { ...acc, balance: newBal };
        }
        return acc;
      }));
    }

    setTransactions(prev => prev.filter(t => t.id !== id));
    if (user) {
      supabase.from('transactions').delete().eq('id', id);
    }
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
      if (user && (acc.id === oldTx.accountId || acc.id === updatedTx.accountId)) {
        supabase.from('accounts').update({ balance }).eq('id', acc.id);
      }
      return { ...acc, balance };
    }));

    setTransactions(prev => prev.map(t => t.id === updatedTx.id ? updatedTx : t));

    if (user) {
      supabase.from('transactions').update({
        type: updatedTx.type,
        amount: updatedTx.amount,
        currency: updatedTx.currency,
        category_id: updatedTx.categoryId,
        account_id: updatedTx.accountId,
        to_account_id: updatedTx.toAccountId,
        date: updatedTx.date,
        time: updatedTx.time,
        description: updatedTx.description,
        tag: updatedTx.tag
      }).eq('id', updatedTx.id);
    }
  };

  // Categories CRUD
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...category,
      id: `cat-${Date.now()}`
    };
    setCategories(prev => [...prev, newCat]);
    if (user) {
      supabase.from('categories').insert({
        id: newCat.id,
        user_id: user.id,
        name: newCat.name,
        icon: newCat.icon,
        color: newCat.color,
        type: newCat.type,
        budget_limit: newCat.budgetLimit
      });
    }
  };

  const editCategory = (updatedCat: Category) => {
    setCategories(prev => prev.map(c => c.id === updatedCat.id ? updatedCat : c));
    if (user) {
      supabase.from('categories').update({
        name: updatedCat.name,
        icon: updatedCat.icon,
        color: updatedCat.color,
        type: updatedCat.type,
        budget_limit: updatedCat.budgetLimit
      }).eq('id', updatedCat.id);
    }
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    if (user) {
      supabase.from('categories').delete().eq('id', id);
    }
  };

  // Accounts CRUD
  const addAccount = (account: Omit<Account, 'id'>) => {
    const newAcc: Account = {
      ...account,
      id: `acc-${Date.now()}`
    };
    setAccounts(prev => [...prev, newAcc]);
    if (user) {
      supabase.from('accounts').insert({
        id: newAcc.id,
        user_id: user.id,
        name: newAcc.name,
        type: newAcc.type,
        balance: newAcc.balance,
        currency: newAcc.currency,
        color: newAcc.color,
        account_number: newAcc.accountNumber
      });
    }
  };

  const editAccount = (updatedAcc: Account) => {
    setAccounts(prev => prev.map(a => a.id === updatedAcc.id ? updatedAcc : a));
    if (user) {
      supabase.from('accounts').update({
        name: updatedAcc.name,
        type: updatedAcc.type,
        balance: updatedAcc.balance,
        currency: updatedAcc.currency,
        color: updatedAcc.color,
        account_number: updatedAcc.accountNumber
      }).eq('id', updatedAcc.id);
    }
  };

  const setAccountBalance = (accountId: string, newBalance: number) => {
    setAccounts(prev => prev.map(a => a.id === accountId ? { ...a, balance: newBalance } : a));
    if (user) {
      supabase.from('accounts').update({ balance: newBalance }).eq('id', accountId);
    }
  };

  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    if (user) {
      supabase.from('accounts').delete().eq('id', id);
    }
  };

  const transferFunds = (fromAccountId: string, toAccountId: string, amount: number, note?: string) => {
    const fromAcc = accounts.find(a => a.id === fromAccountId);
    const toAcc = accounts.find(a => a.id === toAccountId);
    if (!fromAcc || !toAcc || amount <= 0) return;

    let convertedAmount = amount;
    if (fromAcc.currency !== toAcc.currency) {
      const uzsAmount = convertToUZS(amount, fromAcc.currency);
      if (toAcc.currency === 'USD') convertedAmount = uzsAmount / 12850;
      else if (toAcc.currency === 'RUB') convertedAmount = uzsAmount / 135;
      else convertedAmount = uzsAmount;
    }

    const newFromBal = fromAcc.balance - amount;
    const newToBal = toAcc.balance + convertedAmount;

    setAccounts(prev => prev.map(a => {
      if (a.id === fromAccountId) return { ...a, balance: newFromBal };
      if (a.id === toAccountId) return { ...a, balance: newToBal };
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

    if (user) {
      supabase.from('accounts').update({ balance: newFromBal }).eq('id', fromAccountId);
      supabase.from('accounts').update({ balance: newToBal }).eq('id', toAccountId);
      supabase.from('transactions').insert({
        id: transferTx.id,
        user_id: user.id,
        type: transferTx.type,
        amount: transferTx.amount,
        currency: transferTx.currency,
        category_id: transferTx.categoryId,
        account_id: transferTx.accountId,
        to_account_id: transferTx.toAccountId,
        date: transferTx.date,
        time: transferTx.time,
        description: transferTx.description
      });
    }
  };

  // Goals CRUD
  const addGoal = (goal: Omit<Goal, 'id' | 'currentAmount'>) => {
    const newGoal: Goal = {
      ...goal,
      currentAmount: 0,
      id: `goal-${Date.now()}`
    };
    setGoals(prev => [...prev, newGoal]);
    if (user) {
      supabase.from('goals').insert({
        id: newGoal.id,
        user_id: user.id,
        title: newGoal.title,
        target_amount: newGoal.targetAmount,
        current_amount: 0,
        currency: newGoal.currency,
        deadline: newGoal.deadline,
        icon: newGoal.icon,
        color: newGoal.color,
        category: newGoal.category
      });
    }
  };

  const contributeToGoal = (goalId: string, amount: number, fromAccountId?: string) => {
    if (amount <= 0) return;
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        const newAmt = g.currentAmount + amount;
        if (user) supabase.from('goals').update({ current_amount: newAmt }).eq('id', goalId);
        return { ...g, currentAmount: newAmt };
      }
      return g;
    }));

    if (fromAccountId) {
      setAccounts(prev => prev.map(a => {
        if (a.id === fromAccountId) {
          const newBal = a.balance - amount;
          if (user) supabase.from('accounts').update({ balance: newBal }).eq('id', fromAccountId);
          return { ...a, balance: newBal };
        }
        return a;
      }));
    }
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    if (user) {
      supabase.from('goals').delete().eq('id', id);
    }
  };

  // Debts CRUD
  const addDebt = (debt: Omit<Debt, 'id' | 'paidAmount' | 'completed'>) => {
    const newDebt: Debt = {
      ...debt,
      paidAmount: 0,
      completed: false,
      id: `debt-${Date.now()}`
    };
    setDebts(prev => [...prev, newDebt]);
    if (user) {
      supabase.from('debts').insert({
        id: newDebt.id,
        user_id: user.id,
        type: newDebt.type,
        person_name: newDebt.personName,
        amount: newDebt.amount,
        paid_amount: 0,
        currency: newDebt.currency,
        due_date: newDebt.dueDate,
        date: newDebt.date,
        notes: newDebt.notes,
        completed: false
      });
    }
  };

  const payDebt = (debtId: string, amount: number, accountId?: string) => {
    if (amount <= 0) return;
    setDebts(prev => prev.map(d => {
      if (d.id === debtId) {
        const newPaid = d.paidAmount + amount;
        const isDone = newPaid >= d.amount;
        if (user) {
          supabase.from('debts').update({ paid_amount: newPaid, completed: isDone }).eq('id', debtId);
        }
        return { ...d, paidAmount: newPaid, completed: isDone };
      }
      return d;
    }));

    if (accountId) {
      setAccounts(prev => prev.map(a => {
        if (a.id === accountId) {
          const newBal = a.balance - amount;
          if (user) supabase.from('accounts').update({ balance: newBal }).eq('id', accountId);
          return { ...a, balance: newBal };
        }
        return a;
      }));
    }
  };

  const deleteDebt = (id: string) => {
    setDebts(prev => prev.filter(d => d.id !== id));
    if (user) {
      supabase.from('debts').delete().eq('id', id);
    }
  };

  // Subscriptions CRUD
  const addSubscription = (sub: Omit<Subscription, 'id' | 'active'>) => {
    const newSub: Subscription = {
      ...sub,
      active: true,
      id: `sub-${Date.now()}`
    };
    setSubscriptions(prev => [...prev, newSub]);
    if (user) {
      supabase.from('subscriptions').insert({
        id: newSub.id,
        user_id: user.id,
        name: newSub.name,
        amount: newSub.amount,
        currency: newSub.currency,
        frequency: newSub.frequency,
        next_billing_date: newSub.nextBillingDate,
        category_id: newSub.categoryId,
        account_id: newSub.accountId,
        active: true,
        icon: newSub.icon
      });
    }
  };

  const toggleSubscription = (id: string) => {
    setSubscriptions(prev => prev.map(s => {
      if (s.id === id) {
        const newActive = !s.active;
        if (user) supabase.from('subscriptions').update({ active: newActive }).eq('id', id);
        return { ...s, active: newActive };
      }
      return s;
    }));
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
    if (user) {
      supabase.from('subscriptions').delete().eq('id', id);
    }
  };

  // Utilities
  const clearAllData = () => {
    if (window.confirm("Barcha hisoblar, tranzaksiyalar va ma'lumotlar o'chib ketadi. Rozimisiz?")) {
      setTransactions([]);
      setGoals([]);
      setDebts([]);
      setSubscriptions([]);
      setAccounts(INITIAL_ACCOUNTS);
      setCategories(INITIAL_CATEGORIES);

      if (user) {
        Promise.all([
          supabase.from('transactions').delete().eq('user_id', user.id),
          supabase.from('goals').delete().eq('user_id', user.id),
          supabase.from('debts').delete().eq('user_id', user.id),
          supabase.from('subscriptions').delete().eq('user_id', user.id),
          supabase.from('accounts').delete().eq('user_id', user.id),
          supabase.from('categories').delete().eq('user_id', user.id)
        ]);
      }
    }
  };

  // Export JSON
  const exportJSON = () => {
    const data = {
      version: 1,
      exportDate: new Date().toISOString(),
      transactions,
      categories,
      accounts,
      goals,
      debts,
      subscriptions
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `money_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const importJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data && typeof data === 'object') {
        if (data.transactions) setTransactions(data.transactions);
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
        user,
        authLoading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        signOut,
        isCloudSyncing,
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
        exportCSV
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
