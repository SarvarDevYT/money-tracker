import React, { useState, useMemo } from 'react';
import { 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  PieChart as PieIcon, 
  BarChart3, 
  Lightbulb
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, convertToUZS } from '../../utils/formatters';

const CHART_COLORS = [
  '#10b981', // emerald
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#6366f1', // indigo
  '#ec4899', // pink
  '#14b8a6', // teal
  '#8b5cf6', // purple
  '#71717a', // zinc
];

export const AnalyticsView: React.FC = () => {
  const { transactions, categories, totalIncomeThisMonth, totalExpenseThisMonth, hideBalance } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'all'>('month');

  const currentYearMonth = new Date().toISOString().slice(0, 7);

  const periodTransactions = useMemo(() => {
    if (selectedPeriod === 'month') {
      return transactions.filter(t => t.date.startsWith(currentYearMonth));
    }
    return transactions;
  }, [transactions, selectedPeriod, currentYearMonth]);

  const categoryData = useMemo(() => {
    const expenses = periodTransactions.filter(t => t.type === 'expense');
    const totalExp = expenses.reduce((sum, t) => sum + convertToUZS(t.amount, t.currency), 0);

    const map = new Map<string, number>();
    expenses.forEach(t => {
      const current = map.get(t.categoryId) || 0;
      map.set(t.categoryId, current + convertToUZS(t.amount, t.currency));
    });

    const result = Array.from(map.entries()).map(([catId, amount], idx) => {
      const cat = categories.find(c => c.id === catId);
      const percentage = totalExp > 0 ? Math.round((amount / totalExp) * 100) : 0;
      return {
        id: catId,
        name: cat?.name || 'Boshqa',
        value: amount,
        percentage,
        color: CHART_COLORS[idx % CHART_COLORS.length]
      };
    });

    return result.sort((a, b) => b.value - a.value);
  }, [periodTransactions, categories]);

  const cashflowData = useMemo(() => {
    const dayMap = new Map<string, { date: string; income: number; expense: number }>();
    const sorted = [...periodTransactions].sort((a, b) => a.date.localeCompare(b.date));

    sorted.forEach(t => {
      const day = t.date.slice(5);
      if (!dayMap.has(day)) {
        dayMap.set(day, { date: day, income: 0, expense: 0 });
      }
      const item = dayMap.get(day)!;
      const uzs = convertToUZS(t.amount, t.currency);
      if (t.type === 'income') item.income += uzs;
      else item.expense += uzs;
    });

    return Array.from(dayMap.values());
  }, [periodTransactions]);

  const topCategory = categoryData[0];
  const netSavings = totalIncomeThisMonth - totalExpenseThisMonth;

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg text-xs font-mono">
          <p className="text-zinc-200">{data.name}</p>
          <p className="text-zinc-400 mt-0.5">
            {formatCurrency(data.value, 'UZS', hideBalance)} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">
            Tahlil va hisobotlar
          </h1>
          <p className="text-xs text-zinc-500">
            Xarajatlar strukturasi va oqimlar
          </p>
        </div>

        <div className="flex items-center gap-1 p-0.5 bg-zinc-900 rounded-lg border border-zinc-800 text-xs">
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              selectedPeriod === 'month'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Ushbu oy
          </button>
          <button
            onClick={() => setSelectedPeriod('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              selectedPeriod === 'all'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Barcha davr
          </button>
        </div>
      </div>

      {/* Clean Financial Insights Card */}
      <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800/80">
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-300 mb-2">
          <Lightbulb className="w-4 h-4 text-zinc-400" />
          <span>Moliyaviy xulosa</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-400">
          {topCategory && (
            <p className="bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-850">
              Eng asosiy xarajat: <b className="text-zinc-200 font-semibold">{topCategory.name}</b> ({topCategory.percentage}% ulush).
            </p>
          )}
          <p className="bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-850">
            Oylik sof jamg'arma: <b className={`font-mono font-semibold ${netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{formatCurrency(netSavings, 'UZS', hideBalance)}</b>.
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* 1. Category Expense Donut Chart */}
        <div className="p-5 rounded-2xl bg-[#121215] border border-zinc-800/80">
          <div className="mb-2">
            <h3 className="text-xs font-semibold text-zinc-200">Xarajatlar taqsimoti</h3>
            <p className="text-[11px] text-zinc-500">Toifalar bo'yicha ulush</p>
          </div>

          {categoryData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-zinc-600">
              Ma'lumotlar mavjud emas
            </div>
          ) : (
            <div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-zinc-850 max-h-36 overflow-y-auto">
                {categoryData.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between text-xs p-1.5 rounded bg-zinc-900/40">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-zinc-400 truncate">{cat.name}</span>
                    </div>
                    <span className="font-mono text-zinc-300 ml-1 shrink-0">{cat.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. Cashflow Dynamics Bar Chart */}
        <div className="p-5 rounded-2xl bg-[#121215] border border-zinc-800/80">
          <div className="mb-2">
            <h3 className="text-xs font-semibold text-zinc-200">Kirim va chiqimlar oqimi</h3>
            <p className="text-[11px] text-zinc-500">Kunlik dinamika</p>
          </div>

          {cashflowData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-zinc-600">
              Ma'lumotlar mavjud emas
            </div>
          ) : (
            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashflowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                  <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#52525b" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                    formatter={(value: any) => formatCurrency(Number(value), 'UZS', hideBalance)}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="income" name="Kirim" fill="#10b981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="expense" name="Chiqim" fill="#71717a" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
