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
  const [newBalanceInput, setNewBalanceInput] = useState('');

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);

  const displayBalance = selectedAccountId === 'all'
    ? totalBalanceInUZS
    : selectedAccount?.balance || 0;

  const displayCurrency = selectedAccountId === 'all'
    ? 'UZS'
    : selectedAccount?.currency || 'UZS';

  const handleOpenEditBalance = () => {
    const current = selectedAccountId === 'all' ? (accounts[0]?.balance || 0) : (selectedAccount?.balance || 0);
    setNewBalanceInput(current.toString());
    setIsEditBalanceOpen(true);
  };

  const handleSaveBalance = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newBalanceInput);
    if (isNaN(val)) return;

    const targetId = selectedAccountId === 'all' ? accounts[0]?.id : selectedAccountId;
    if (targetId) {
      setAccountBalance(targetId, val);
    }
    setIsEditBalanceOpen(false);
  };

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
              {acc.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Balance */}
      <div className="my-2 flex flex-wrap items-baseline gap-3">
        <p className="text-3xl sm:text-4xl font-semibold tracking-tight text-white font-mono">
          {formatCurrency(displayBalance, displayCurrency, hideBalance)}
        </p>

        <button
          onClick={handleOpenEditBalance}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-medium border border-zinc-800 transition-colors"
          title="Boshlang'ich yoki joriy balansni o'rnatish"
        >
          <Edit3 className="w-3 h-3" />
          <span>Balansni kiritish</span>
        </button>
      </div>

      {displayBalance === 0 && (
        <p className="text-[11px] text-zinc-500 mt-1">
          Hozircha balans 0 so'm. Boshlang'ich mablag'ingizni kiritish uchun <b className="text-zinc-400">"Balansni kiritish"</b> yoki <b className="text-emerald-400">"+ Daromad"</b> tugmasidan foydalaning.
        </p>
      )}

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
              <p className="text-xs font-semibold text-zinc-200 font-mono">
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
              <p className="text-xs font-semibold text-zinc-200 font-mono">
                -{formatCurrency(totalExpenseThisMonth, 'UZS', hideBalance)}
              </p>
            </div>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
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

      {/* Edit Balance Modal */}
      {isEditBalanceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-[#121215] border border-zinc-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">
                Balansni o'rnatish
              </h3>
              <button 
                onClick={() => setIsEditBalanceOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-500">
              {selectedAccountId === 'all' ? accounts[0]?.name : selectedAccount?.name} hisobingizdagi hozirgi real summani kiriting:
            </p>

            <form onSubmit={handleSaveBalance} className="space-y-3">
              <input
                type="number"
                step="any"
                required
                placeholder="0.00"
                value={newBalanceInput}
                onChange={(e) => setNewBalanceInput(e.target.value)}
                autoFocus
                className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-lg outline-none focus:border-zinc-700"
              />

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditBalanceOpen(false)}
                  className="flex-1 py-2 rounded-lg bg-zinc-900 text-zinc-400 text-xs hover:text-white"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-emerald-500 text-zinc-950 font-semibold text-xs hover:bg-emerald-400"
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
