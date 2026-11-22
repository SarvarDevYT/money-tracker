import React, { useState } from 'react';
import { Target, Plus, Trash2, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { Goal } from '../../types';

export const GoalsView: React.FC = () => {
  const { goals, addGoal, contributeToGoal, deleteGoal, accounts, hideBalance } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [contributeGoal, setContributeGoal] = useState<Goal | null>(null);

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  const [addAmount, setAddAmount] = useState('');
  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id || '');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    if (!title.trim() || !target || target <= 0) {
      alert("Maqsad nomi va summasini kiriting!");
      return;
    }

    addGoal({
      title: title.trim(),
      targetAmount: target,
      currency: 'UZS',
      deadline: deadline || undefined,
      icon: 'Target',
      color: '#10B981'
    });

    setTitle('');
    setTargetAmount('');
    setDeadline('');
    setIsAddModalOpen(false);
  };

  const handleContributeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributeGoal) return;
    const amount = parseFloat(addAmount);
    if (!amount || amount <= 0) return;

    contributeToGoal(contributeGoal.id, amount, fromAccountId || undefined);

    if (contributeGoal.currentAmount + amount >= contributeGoal.targetAmount) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }

    setAddAmount('');
    setContributeGoal(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">
            Moliyaviy maqsadlar
          </h1>
          <p className="text-xs text-zinc-500">
            Jamg'arma va rejalashtirilgan xaridlar
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Yangi maqsad</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {goals.map(goal => {
          const percentage = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
          const isReached = goal.currentAmount >= goal.targetAmount;
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

          return (
            <div 
              key={goal.id}
              className="p-4 rounded-xl bg-[#121215] border border-zinc-800/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-medium text-zinc-200">{goal.title}</span>
                  <button
                    onClick={() => {
                      if (window.confirm("O'chirilsinmi?")) {
                        deleteGoal(goal.id);
                      }
                    }}
                    className="p-1 text-zinc-600 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {goal.deadline && (
                  <p className="text-[11px] text-zinc-500 flex items-center gap-1 mb-3">
                    <Calendar className="w-3 h-3 text-zinc-600" />
                    <span>Muddati: {goal.deadline}</span>
                  </p>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-200">
                      {formatCurrency(goal.currentAmount, goal.currency, hideBalance)}
                    </span>
                    <span className="text-zinc-500">
                      {formatCurrency(goal.targetAmount, goal.currency, hideBalance)}
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${isReached ? 'bg-emerald-400' : 'bg-emerald-500'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-0.5">
                    <span>{percentage}% bajarildi</span>
                    <span>{isReached ? "Tugallandi" : `Qoldi: ${formatCurrency(remaining, goal.currency, hideBalance)}`}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-850">
                <button
                  onClick={() => setContributeGoal(goal)}
                  className="w-full py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors"
                >
                  Mablag' qo'shish
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-[#121215] border border-zinc-800 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-100">Yangi maqsad</h3>
            <form onSubmit={handleCreateGoal} className="space-y-3">
              <div>
                <label className="text-[11px] text-zinc-400">Maqsad nomi:</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Yangi noutbuk"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400">Kerakli summa (so'm):</label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 font-mono outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400">Muddat (ixtiyoriy):</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 outline-none mt-1"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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

      {/* Contribute Modal */}
      {contributeGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-[#121215] border border-zinc-800 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-100">
              "{contributeGoal.title}" ga mablag' qo'shish
            </h3>

            <form onSubmit={handleContributeSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] text-zinc-400">Summa ({contributeGoal.currency}):</label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  autoFocus
                  className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-sm outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400">Hisobdan yechish (ixtiyoriy):</label>
                <select
                  value={fromAccountId}
                  onChange={(e) => setFromAccountId(e.target.value)}
                  className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 outline-none mt-1"
                >
                  <option value="">Hisobdan yechilmasin</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setContributeGoal(null)}
                  className="flex-1 py-2 rounded-lg bg-zinc-900 text-zinc-400 text-xs hover:text-white"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-emerald-500 text-zinc-950 font-semibold text-xs hover:bg-emerald-400"
                >
                  Qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
