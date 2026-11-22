import React from 'react';
import { ArrowRight, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDateUz } from '../../utils/formatters';
import { IconRenderer } from '../common/IconRenderer';

interface RecentTransactionsProps {
  onOpenAddModal: (type?: 'expense' | 'income') => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ onOpenAddModal }) => {
  const { transactions, categories, accounts, deleteTransaction, setActiveTab, hideBalance } = useApp();

  const recent = transactions.slice(0, 6);

  return (
    <div className="p-5 rounded-2xl bg-[#121215] border border-zinc-800/80">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-semibold text-zinc-200">So'nggi operatsiyalar</h3>
          <p className="text-[11px] text-zinc-500">Yaqinda amalga oshirilgan tranzaksiyalar</p>
        </div>
        <button
          onClick={() => setActiveTab('transactions')}
          className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
        >
          <span>Hammasi ({transactions.length})</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="text-center py-10 text-xs text-zinc-500">
          Tranzaksiyalar mavjud emas.
        </div>
      ) : (
        <div className="divide-y divide-zinc-850">
          {recent.map((tx) => {
            const category = categories.find(c => c.id === tx.categoryId);
            const account = accounts.find(a => a.id === tx.accountId);
            const isIncome = tx.type === 'income';

            return (
              <div 
                key={tx.id} 
                className="py-2.5 flex items-center justify-between gap-3 group hover:bg-zinc-900/40 px-2 rounded-lg transition-colors"
              >
                {/* Left */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
                    <IconRenderer name={category?.icon || 'CircleDot'} className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-200 truncate">
                      {category?.name || 'Kategoriya'}
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate">
                      {tx.description || account?.name}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className={`text-xs font-semibold font-mono ${isIncome ? 'text-emerald-400' : 'text-zinc-200'}`}>
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount, tx.currency, hideBalance)}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      {formatDateUz(tx.date)}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm("O'chirilsinmi?")) {
                        deleteTransaction(tx.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-zinc-500 hover:text-rose-400 transition-all"
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
  );
};
