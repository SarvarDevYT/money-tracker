import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Plus, 
  Trash2, 
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDateUz, convertToUZS } from '../../utils/formatters';
import { IconRenderer } from '../common/IconRenderer';

interface TransactionListProps {
  onOpenAddModal: (type?: 'expense' | 'income') => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ onOpenAddModal }) => {
  const { 
    transactions, 
    categories, 
    accounts, 
    deleteTransaction, 
    exportCSV, 
    hideBalance 
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'expense' | 'income'>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'all' | 'today' | 'week' | 'month'>('month');

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const currentYearMonth = new Date().toISOString().slice(0, 7);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return transactions.filter(t => {
      if (search) {
        const query = search.toLowerCase();
        const cat = categories.find(c => c.id === t.categoryId)?.name.toLowerCase() || '';
        const acc = accounts.find(a => a.id === t.accountId)?.name.toLowerCase() || '';
        const desc = (t.description || '').toLowerCase();
        if (!cat.includes(query) && !acc.includes(query) && !desc.includes(query)) {
          return false;
        }
      }

      if (selectedType !== 'all' && t.type !== selectedType) return false;
      if (selectedCategoryId !== 'all' && t.categoryId !== selectedCategoryId) return false;
      if (selectedAccountId !== 'all' && t.accountId !== selectedAccountId) return false;

      if (timeRange === 'today' && t.date !== today) return false;
      if (timeRange === 'week' && t.date < weekAgo) return false;
      if (timeRange === 'month' && !t.date.startsWith(currentYearMonth)) return false;

      return true;
    });
  }, [transactions, categories, accounts, search, selectedType, selectedCategoryId, selectedAccountId, timeRange]);

  const filteredIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + convertToUZS(t.amount, t.currency), 0);

  const filteredExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + convertToUZS(t.amount, t.currency), 0);

  const resetFilters = () => {
    setSearch('');
    setSelectedType('all');
    setSelectedCategoryId('all');
    setSelectedAccountId('all');
    setTimeRange('all');
  };

  const hasActiveFilters = search || selectedType !== 'all' || selectedCategoryId !== 'all' || selectedAccountId !== 'all' || timeRange !== 'month';

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3">
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-zinc-100">
            Tranzaksiyalar
          </h1>
          <p className="text-[11px] text-zinc-500">
            Barcha kirim va chiqimlar ro'yxati
          </p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          <button
            onClick={exportCSV}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => onOpenAddModal('expense')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors"
          >
            <span className="text-rose-400 font-bold">-</span>
            <span>Xarajat</span>
          </button>

          <button
            onClick={() => onOpenAddModal('income')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Daromad</span>
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-[#121215] border border-zinc-800/80">
        <div className="min-w-0">
          <p className="text-[10px] text-zinc-500 uppercase">Kirim</p>
          <p className="text-xs sm:text-sm font-semibold text-emerald-400 font-mono mt-0.5 truncate">
            +{formatCurrency(filteredIncome, 'UZS', hideBalance)}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-zinc-500 uppercase">Chiqim</p>
          <p className="text-xs sm:text-sm font-semibold text-zinc-200 font-mono mt-0.5 truncate">
            -{formatCurrency(filteredExpense, 'UZS', hideBalance)}
          </p>
        </div>
        <div className="text-right min-w-0">
          <p className="text-[10px] text-zinc-500 uppercase">Soni</p>
          <p className="text-xs sm:text-sm font-semibold text-zinc-300 font-mono mt-0.5">
            {filteredTransactions.length} ta
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="p-3 sm:p-3.5 rounded-xl bg-[#121215] border border-zinc-800/80 space-y-2.5 sm:space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Qidirish (kategoriya, izoh)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 sm:py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-700"
            />
          </div>

          {/* Time range pills with mobile horizontal scroll */}
          <div className="flex items-center gap-1 p-0.5 bg-zinc-900 rounded-lg border border-zinc-800 text-xs overflow-x-auto no-scrollbar shrink-0">
            {[
              { id: 'today', label: 'Bugun' },
              { id: 'week', label: 'Hafta' },
              { id: 'month', label: 'Oy' },
              { id: 'all', label: 'Hammasi' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id as any)}
                className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                  timeRange === t.id
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-850">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg bg-zinc-900 text-xs text-zinc-300 border border-zinc-800 outline-none cursor-pointer"
          >
            <option value="all">Barcha turlar</option>
            <option value="expense">Faqat xarajat</option>
            <option value="income">Faqat daromad</option>
          </select>

          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg bg-zinc-900 text-xs text-zinc-300 border border-zinc-800 outline-none cursor-pointer"
          >
            <option value="all">Barcha toifalar</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-1.5 rounded-lg bg-zinc-900 text-xs text-zinc-300 border border-zinc-800 outline-none cursor-pointer"
          >
            <option value="all">Barcha hisoblar</option>
            {accounts.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-zinc-400 hover:text-zinc-200 text-xs ml-auto transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Tozalash</span>
            </button>
          )}
        </div>
      </div>

      {/* Transactions List */}
      <div className="rounded-xl bg-[#121215] border border-zinc-800/80 overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-xs text-zinc-500">
            Tranzaksiyalar topilmadi.
          </div>
        ) : (
          <div className="divide-y divide-zinc-850">
            {filteredTransactions.map(tx => {
              const category = categories.find(c => c.id === tx.categoryId);
              const account = accounts.find(a => a.id === tx.accountId);
              const isIncome = tx.type === 'income';

              return (
                <div 
                  key={tx.id}
                  className="p-3 sm:p-3.5 flex items-center justify-between gap-2.5 sm:gap-3 group hover:bg-zinc-900/30 transition-colors"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
                      <IconRenderer name={category?.icon || 'CircleDot'} className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-medium text-zinc-200 truncate">
                          {category?.name || 'Kategoriya'}
                        </p>
                        <span className="text-[10px] text-zinc-500 truncate">
                          • {account?.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                        {tx.description || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <div className="text-right">
                      <p className={`text-xs sm:text-sm font-semibold font-mono ${isIncome ? 'text-emerald-400' : 'text-zinc-200'}`}>
                        {isIncome ? '+' : '-'}{formatCurrency(tx.amount, tx.currency, hideBalance)}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        {formatDateUz(tx.date)}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm("O'chirilsinmi?")) {
                          deleteTransaction(tx.id);
                        }
                      }}
                      className="p-1.5 text-zinc-600 hover:text-rose-400 transition-colors"
                      title="O'chirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
