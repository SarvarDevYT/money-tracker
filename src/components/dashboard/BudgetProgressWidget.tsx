import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, convertToUZS } from '../../utils/formatters';
import { IconRenderer } from '../common/IconRenderer';

export const BudgetProgressWidget: React.FC = () => {
  const { categories, transactions, setActiveTab, hideBalance } = useApp();

  const currentMonthPrefix = new Date().toISOString().slice(0, 7);

  const categoriesWithBudget = categories
    .filter(c => c.type === 'expense' && c.budgetLimit && c.budgetLimit > 0)
    .map(category => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.categoryId === category.id && t.date.startsWith(currentMonthPrefix))
        .reduce((sum, t) => sum + convertToUZS(t.amount, t.currency), 0);

      const limit = category.budgetLimit || 1;
      const percentage = Math.min(Math.round((spent / limit) * 100), 100);
      const isExceeded = spent > limit;

      return {
        ...category,
        spent,
        limit,
        percentage,
        isExceeded,
      };
    })
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 4);

  if (categoriesWithBudget.length === 0) return null;

  return (
    <div className="p-5 rounded-2xl bg-[#121215] border border-zinc-800/80">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-semibold text-zinc-200">Byudjet nazorati</h3>
          <p className="text-[11px] text-zinc-500">Oylik limitlar</p>
        </div>
        <button
          onClick={() => setActiveTab('budgets')}
          className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
        >
          <span>Hammasi</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-3.5">
        {categoriesWithBudget.map(cat => {
          return (
            <div key={cat.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                    <IconRenderer name={cat.icon} className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-zinc-300 truncate">{cat.name}</span>
                </div>

                <span className={`font-mono text-[11px] ${cat.isExceeded ? 'text-rose-400 font-semibold' : 'text-zinc-400'}`}>
                  {cat.percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${cat.isExceeded ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>{formatCurrency(cat.spent, 'UZS', hideBalance)}</span>
                <span>/ {formatCurrency(cat.limit, 'UZS', hideBalance)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
