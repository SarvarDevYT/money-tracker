import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowLeftRight,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

interface BalanceCardProps {
  onOpenTransfer: () => void;
  onOpenAddModal: (type: 'expense' | 'income') => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ onOpenTransfer, onOpenAddModal }) => {
  const { accounts, totalBalanceInUZS, hideBalance, setHideBalance, totalIncomeThisMonth, totalExpenseThisMonth } = useApp();
  const [selectedAccountId, setSelectedAccountId] = useState<string>('all');

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);

  const displayBalance = selectedAccountId === 'all'
    ? totalBalanceInUZS
    : selectedAccount?.balance || 0;

  const displayCurrency = selectedAccountId === 'all'
    ? 'UZS'
    : selectedAccount?.currency || 'UZS';

  return (
    <div className="rounded-2xl bg-[#121215] border border-zinc-800/90 p-5 sm:p-6 shadow-sm">
      {/* Top Header of Card */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-400">
            {selectedAccountId === 'all' ? "Umumiy balans" : selectedAccount?.name}
          </span>
          <button 
            onClick={() => setHideBalance(prev => !prev)}
            className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5"
            title={hideBalance ? "Balansni ko'rsatish" : "Balansni yashirish"}
          >
            {hideBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Account Switcher Tabs */}
        <div className="flex items-center gap-1 p-0.5 bg-zinc-900 rounded-lg border border-zinc-800 text-xs">
          <button
            onClick={() => setSelectedAccountId('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              selectedAccountId === 'all'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Barchasi
          </button>
          {accounts.map(acc => (
            <button
              key={acc.id}
              onClick={() => setSelectedAccountId(acc.id)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedAccountId === acc.id
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {acc.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Balance */}
      <div className="my-2">
        <p className="text-3xl sm:text-4xl font-semibold tracking-tight text-white font-mono">
          {formatCurrency(displayBalance, displayCurrency, hideBalance)}
        </p>
        {selectedAccountId === 'all' && (
          <p className="text-xs text-zinc-500 mt-1 font-mono">
            ≈ {formatCurrency(totalBalanceInUZS / 12850, 'USD', hideBalance)}
          </p>
        )}
      </div>

      {/* Bottom Summary & Actions */}
      <div className="pt-5 mt-5 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
        {/* Monthly In/Out Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
              <ArrowDownLeft className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Kirim</p>
              <p className="text-xs font-semibold text-zinc-200">
                +{formatCurrency(totalIncomeThisMonth, 'UZS', hideBalance)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Chiqim</p>
              <p className="text-xs font-semibold text-zinc-200">
                -{formatCurrency(totalExpenseThisMonth, 'UZS', hideBalance)}
              </p>
            </div>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTransfer}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-zinc-400" />
            <span>O'tkazma</span>
          </button>
          <button
            onClick={() => onOpenAddModal('expense')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors"
          >
            <span className="text-rose-400 font-bold">-</span>
            <span>Xarajat</span>
          </button>
          <button
            onClick={() => onOpenAddModal('income')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Daromad</span>
          </button>
        </div>
      </div>
    </div>
  );
};
