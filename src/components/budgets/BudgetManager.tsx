import React, { useState } from 'react';
import { Edit2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, convertToUZS } from '../../utils/formatters';
import { IconRenderer } from '../common/IconRenderer';
import { Category } from '../../types';

export const BudgetManager: React.FC = () => {
  const { categories, transactions, editCategory, hideBalance } = useApp();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newLimit, setNewLimit] = useState<string>('');

  const currentYearMonth = new Date().toISOString().slice(0, 7);
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setNewLimit((cat.budgetLimit || 0).toString());
  };

  const handleSaveLimit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    const parsed = parseFloat(newLimit) || 0;
    editCategory({
      ...editingCategory,
      budgetLimit: parsed > 0 ? parsed : undefined
    });

    setEditingCategory(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-zinc-100">
          Byudjet limitlari
        </h1>
        <p className="text-xs text-zinc-500">
          Kategoriyalar bo'yicha oylik sarf-xarajat me'yori
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {expenseCategories.map(cat => {
          const spent = transactions
            .filter(t => t.type === 'expense' && t.categoryId === cat.id && t.date.startsWith(currentYearMonth))
            .reduce((sum, t) => sum + convertToUZS(t.amount, t.currency), 0);

          const hasLimit = cat.budgetLimit && cat.budgetLimit > 0;
          const limit = cat.budgetLimit || 0;
          const percentage = hasLimit ? Math.min(Math.round((spent / limit) * 100), 100) : 0;
          const isExceeded = hasLimit && spent > limit;

          return (
            <div 
              key={cat.id}
              className={`p-4 rounded-xl bg-[#121215] border transition-colors ${
                isExceeded ? 'border-rose-500/50' : 'border-zinc-800/80'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                    <IconRenderer name={cat.icon} className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-zinc-200">{cat.name}</h3>
                    <p className="text-[11px] text-zinc-500 font-mono">
                      Sarflangan: {formatCurrency(spent, 'UZS', hideBalance)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                  title="Limitni o'zgartirish"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {hasLimit ? (
                <div className="space-y-1.5 mt-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500">Limit: {formatCurrency(limit, 'UZS', hideBalance)}</span>
                    <span className={isExceeded ? 'text-rose-400 font-semibold' : 'text-zinc-400'}>
                      {percentage}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${isExceeded ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-0.5">
                    {isExceeded ? (
                      <span className="text-rose-400">Limitdan {formatCurrency(spent - limit, 'UZS', hideBalance)} oshdi</span>
                    ) : (
                      <span>Qoldiq: {formatCurrency(limit - spent, 'UZS', hideBalance)}</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-3 pt-2.5 border-t border-zinc-850 flex items-center justify-between text-xs">
                  <span className="text-zinc-600">Limit qo'yilmagan</span>
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="text-zinc-400 hover:text-white"
                  >
                    + Limit belgilash
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-[#121215] border border-zinc-800 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-100">
              "{editingCategory.name}" limiti
            </h3>
            <p className="text-xs text-zinc-500">
              Oylik maksimal rejalashtirilgan xarajat:
            </p>

            <form onSubmit={handleSaveLimit} className="space-y-3">
              <input
                type="number"
                step="any"
                placeholder="Summa (so'm)"
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                autoFocus
                className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-sm outline-none focus:border-zinc-700"
              />

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
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
