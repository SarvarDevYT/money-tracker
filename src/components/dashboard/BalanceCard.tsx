import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus,
  Edit3,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

interface BalanceCardProps {
  onOpenAddModal: (type: 'expense' | 'income') => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ onOpenAddModal }) => {
  const { 
    accounts, 
    totalBalanceInUZS, 
    hideBalance, 
    setHideBalance, 
    totalIncomeThisMonth, 
    totalExpenseThisMonth,
    setAccountBalance 
  } = useApp();

  const [selectedAccountId, setSelectedAccountId] = useState<string>('all');
  const [isEditBalanceOpen, setIsEditBalanceOpen] = useState(false);
  const [editTargetAccountId, setEditTargetAccountId] = useState<string>('');
  const [newBalanceInput, setNewBalanceInput] = useState('');

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);

  const displayBalance = selectedAccountId === 'all'
    ? totalBalanceInUZS
    : selectedAccount?.balance || 0;

  const displayCurrency = selectedAccountId === 'all'
    ? 'UZS'
    : selectedAccount?.currency || 'UZS';

  const handleOpenEditBalance = () => {
    const targetId = selectedAccountId === 'all' ? (accounts[0]?.id || '') : selectedAccountId;
    setEditTargetAccountId(targetId);
    const acc = accounts.find(a => a.id === targetId);
    setNewBalanceInput((acc?.balance || 0).toString());
    setIsEditBalanceOpen(true);
  };

  const handleSelectAccountForEdit = (accId: string) => {
    setEditTargetAccountId(accId);
    const acc = accounts.find(a => a.id === accId);
    setNewBalanceInput((acc?.balance || 0).toString());
  };

  const handleSaveBalance = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newBalanceInput);
    if (isNaN(val)) return;

    if (editTargetAccountId) {
      setAccountBalance(editTargetAccountId, val);
    }
    setIsEditBalanceOpen(false);
  };

  return (
    <div className="rounded-2xl bg-[#121215] border border-zinc-800/90 p-4 sm:p-6 shadow-sm">
      {/* Top Header of Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 sm:mb-5">
        <div className="flex items-center justify-between sm:justify-start gap-2">
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

        {/* Account Switcher Tabs with smooth mobile swipe scroll */}
        <div className="flex items-center gap-1 p-0.5 bg-zinc-900 rounded-lg border border-zinc-800 text-xs overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setSelectedAccountId('all')}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
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
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedAccountId === acc.id
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {acc.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Balance Display */}
      <div className="my-1 sm:my-2">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white font-mono break-all">
            {formatCurrency(displayBalance, displayCurrency, hideBalance)}
          </p>

          <button
            onClick={handleOpenEditBalance}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-[11px] font-medium border border-zinc-800 transition-colors shrink-0"
            title="Balansni kiritish yoki to'g'rilash"
          >
            <Edit3 className="w-3 h-3" />
            <span>Balansni kiritish</span>
          </button>
        </div>

        {selectedAccountId === 'all' && (
          <p className="text-[11px] text-zinc-500 mt-1 font-mono">
            ≈ {formatCurrency(totalBalanceInUZS / 12850, 'USD', hideBalance)}
          </p>
        )}
      </div>

      {displayBalance === 0 && (
        <p className="text-[11px] text-zinc-500 mt-2">
          Hozircha balans 0 so'm. Boshlang'ich pulingizni kiritish uchun <b className="text-zinc-400">"Balansni kiritish"</b> yoki <b className="text-emerald-400">"+ Daromad"</b> tugmasidan foydalaning.
        </p>
      )}

      {/* Bottom Summary & Actions */}
      <div className="pt-4 sm:pt-5 mt-4 sm:mt-5 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        {/* Monthly In/Out Stats */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
              <ArrowDownLeft className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Kirim</p>
              <p className="text-xs font-semibold text-zinc-200 font-mono truncate">
                +{formatCurrency(totalIncomeThisMonth, 'UZS', hideBalance)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-400 shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Chiqim</p>
              <p className="text-xs font-semibold text-zinc-200 font-mono truncate">
                -{formatCurrency(totalExpenseThisMonth, 'UZS', hideBalance)}
              </p>
            </div>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="grid grid-cols-2 sm:flex items-center gap-2">
          <button
            onClick={() => onOpenAddModal('expense')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-3 py-2 sm:py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors"
          >
            <span className="text-rose-400 font-bold">-</span>
            <span>Xarajat</span>
          </button>
          <button
            onClick={() => onOpenAddModal('income')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-3 py-2 sm:py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Daromad</span>
          </button>
        </div>
      </div>

      {/* Edit Balance Modal (Responsive Bottom Sheet on Mobile) */}
      {isEditBalanceOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl bg-[#121215] border-t sm:border border-zinc-800 p-5 pb-8 sm:pb-5 space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">
                  Balansni kiritish / to'g'rilash
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Hisobingizdagi hozirgi real qoldiq summasi
                </p>
              </div>
              <button 
                onClick={() => setIsEditBalanceOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBalance} className="space-y-3">
              <div>
                <label className="text-[11px] text-zinc-400 font-medium">Qaysi hisob balansi o'zgartirilsin:</label>
                <select
                  value={editTargetAccountId}
                  onChange={(e) => handleSelectAccountForEdit(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 outline-none focus:border-zinc-700 mt-1"
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (Hozirgi: {formatCurrency(acc.balance, acc.currency, hideBalance)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 font-medium">Haqiqiy balans summasi ({accounts.find(a => a.id === editTargetAccountId)?.currency || 'UZS'}):</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="0.00"
                  value={newBalanceInput}
                  onChange={(e) => setNewBalanceInput(e.target.value)}
                  autoFocus
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-lg outline-none focus:border-zinc-700 mt-1"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditBalanceOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white text-xs font-medium border border-zinc-800 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-colors"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
