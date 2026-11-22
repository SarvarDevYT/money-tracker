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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Monthly Income */}
      <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800/80">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
          <span>Oylik daromad</span>
          <TrendingUp className="w-4 h-4 text-emerald-400" />
        </div>
        <p className="text-lg font-semibold text-zinc-100 font-mono">
          {formatCurrency(totalIncomeThisMonth, 'UZS', hideBalance)}
        </p>
        <p className="text-[11px] text-zinc-500 mt-1">Ushbu oy uchun</p>
      </div>

      {/* 2. Monthly Expense */}
      <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800/80">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
          <span>Oylik xarajat</span>
          <TrendingDown className="w-4 h-4 text-rose-400" />
        </div>
        <p className="text-lg font-semibold text-zinc-100 font-mono">
          {formatCurrency(totalExpenseThisMonth, 'UZS', hideBalance)}
        </p>
        <p className="text-[11px] text-zinc-500 mt-1">Ushbu oy uchun</p>
      </div>

      {/* 3. Net Savings */}
      <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800/80">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
          <span>Sof jamg'arma</span>
          <Wallet className="w-4 h-4 text-zinc-400" />
        </div>
        <p className={`text-lg font-semibold font-mono ${netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {formatCurrency(netSavings, 'UZS', hideBalance)}
        </p>
        <p className="text-[11px] text-zinc-500 mt-1">
          {savingsRate >= 0 ? `Kirimning ${savingsRate}% qismi` : 'Xarajat daromaddan ko\'p'}
        </p>
      </div>

      {/* 4. Debts */}
      <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800/80">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
          <span>Berilgan qarzlar</span>
          <HandCoins className="w-4 h-4 text-zinc-400" />
        </div>
        <p className="text-lg font-semibold text-zinc-100 font-mono">
          {formatCurrency(pendingToCollect, 'UZS', hideBalance)}
        </p>
        <p className="text-[11px] text-zinc-500 mt-1">Qaytarilishi kutilmoqda</p>
      </div>
    </div>
  );
};
