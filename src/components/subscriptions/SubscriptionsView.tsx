import React, { useState } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, convertToUZS } from '../../utils/formatters';

export const SubscriptionsView: React.FC = () => {
  const { subscriptions, addSubscription, toggleSubscription, deleteSubscription, categories, accounts, hideBalance } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<'monthly' | 'yearly'>('monthly');
  const [nextDate, setNextDate] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');

  const totalMonthlyCostInUZS = subscriptions
    .filter(s => s.active)
    .reduce((sum, s) => {
      let monthlyAmount = s.amount;
      if (s.frequency === 'yearly') monthlyAmount = s.amount / 12;
      return sum + convertToUZS(monthlyAmount, s.currency);
    }, 0);

  const handleCreateSub = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!name.trim() || !parsed || parsed <= 0) return;

    const acc = accounts.find(a => a.id === accountId);

    addSubscription({
      name: name.trim(),
      amount: parsed,
      currency: acc ? acc.currency : 'UZS',
      frequency,
      nextBillingDate: nextDate || new Date().toISOString().split('T')[0],
      categoryId: categoryId || 'cat-bills',
      accountId: accountId || 'acc-card',
    });

    setName('');
    setAmount('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">
            Doimiy to'lovlar va obunalar
          </h1>
          <p className="text-xs text-zinc-500">
            Har oy yoki har yil takrorlanadigan xizmatlar
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Yangi obuna</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800/80 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-zinc-500">Oylik doimiy to'lovlar jami:</p>
          <p className="text-lg font-semibold text-zinc-100 font-mono mt-0.5">
            {formatCurrency(totalMonthlyCostInUZS, 'UZS', hideBalance)}
            <span className="text-xs font-normal text-zinc-500 ml-1">/ oyiga</span>
          </p>
        </div>
        <p className="text-xs text-zinc-400">
          Faol: <b className="text-zinc-200">{subscriptions.filter(s => s.active).length} ta</b>
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {subscriptions.map(sub => {
          const account = accounts.find(a => a.id === sub.accountId);

          return (
            <div 
              key={sub.id}
              className={`p-4 rounded-xl bg-[#121215] border transition-colors flex flex-col justify-between ${
                sub.active ? 'border-zinc-800/80' : 'border-zinc-850 opacity-40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-zinc-200">{sub.name}</span>
                  <button
                    onClick={() => {
                      if (window.confirm("O'chirilsinmi?")) {
                        deleteSubscription(sub.id);
                      }
                    }}
                    className="p-1 text-zinc-600 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="my-2.5">
                  <p className="text-base font-semibold text-zinc-100 font-mono">
                    {formatCurrency(sub.amount, sub.currency, hideBalance)}
                  </p>
                  <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3 text-zinc-600" />
                    <span>To'lov sanasi: {sub.nextBillingDate}</span>
                  </p>
                </div>
              </div>

              <div className="pt-2.5 border-t border-zinc-850 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">{account?.name}</span>
                <button
                  onClick={() => toggleSubscription(sub.id)}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                    sub.active
                      ? 'bg-zinc-800 text-zinc-200 border-zinc-700'
                      : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                  }`}
                >
                  {sub.active ? 'Faol' : 'To\'xtatilgan'}
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
            <h3 className="text-sm font-semibold text-zinc-100">Yangi obuna</h3>

            <form onSubmit={handleCreateSub} className="space-y-3">
              <div>
                <label className="text-[11px] text-zinc-400">Xizmat nomi:</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Yandex Plus, Netflix"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 outline-none mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-zinc-400">Summa:</label>
                  <input
                    type="number"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 font-mono outline-none mt-1"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400">Davriylik:</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 outline-none mt-1"
                  >
                    <option value="monthly">Har oy</option>
                    <option value="yearly">Har yil</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400">Navbatdagi sana:</label>
                <input
                  type="date"
                  value={nextDate}
                  onChange={(e) => setNextDate(e.target.value)}
                  className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400">Bog'langan hisob:</label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 outline-none mt-1"
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name} ({acc.currency})</option>
                  ))}
                </select>
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
    </div>
  );
};
