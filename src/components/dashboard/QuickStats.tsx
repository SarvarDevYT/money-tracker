import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  HandCoins 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

export const QuickStats: React.FC = () => {
  const { totalIncomeThisMonth, totalExpenseThisMonth, hideBalance, debts } = useApp();

  const netSavings = totalIncomeThisMonth - totalExpenseThisMonth;
  const savingsRate = totalIncomeThisMonth > 0 
    ? Math.round((netSavings / totalIncomeThisMonth) * 100) 
    : 0;

  const pendingToCollect = debts
    .filter(d => d.type === 'lent' && !d.completed)
    .reduce((sum, d) => sum + (d.amount - d.paidAmount), 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
      {/* 1. Monthly Income */}
      <div className="p-3 sm:p-4 rounded-xl bg-[#121215] border border-zinc-800/80">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
          <span className="truncate">Oylik daromad</span>
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
        </div>
        <p className="text-sm sm:text-lg font-semibold text-zinc-100 font-mono truncate">
          {formatCurrency(totalIncomeThisMonth, 'UZS', hideBalance)}
        </p>
        <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Ushbu oy uchun</p>
      </div>

      {/* 2. Monthly Expense */}
      <div className="p-3 sm:p-4 rounded-xl bg-[#121215] border border-zinc-800/80">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
          <span className="truncate">Oylik xarajat</span>
          <TrendingDown className="w-3.5 h-3.5 text-rose-400 shrink-0 ml-1" />
        </div>
        <p className="text-sm sm:text-lg font-semibold text-zinc-100 font-mono truncate">
          {formatCurrency(totalExpenseThisMonth, 'UZS', hideBalance)}
        </p>
        <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Ushbu oy uchun</p>
      </div>

      {/* 3. Net Savings */}
      <div className="p-3 sm:p-4 rounded-xl bg-[#121215] border border-zinc-800/80">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
          <span className="truncate">Sof jamg'arma</span>
          <Wallet className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-1" />
        </div>
        <p className={`text-sm sm:text-lg font-semibold font-mono truncate ${netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {formatCurrency(netSavings, 'UZS', hideBalance)}
        </p>
        <p className="text-[10px] text-zinc-500 mt-0.5 truncate">
          {savingsRate >= 0 ? `Kirimning ${savingsRate}% qismi` : 'Xarajat ortiq'}
        </p>
      </div>

      {/* 4. Debts */}
      <div className="p-3 sm:p-4 rounded-xl bg-[#121215] border border-zinc-800/80">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
          <span className="truncate">Berilgan qarz</span>
          <HandCoins className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-1" />
        </div>
        <p className="text-sm sm:text-lg font-semibold text-zinc-100 font-mono truncate">
          {formatCurrency(pendingToCollect, 'UZS', hideBalance)}
        </p>
        <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Qaytarilishi kerak</p>
      </div>
    </div>
  );
};
