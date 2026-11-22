import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDateUz } from '../../utils/formatters';
import { Debt } from '../../types';

export const DebtsView: React.FC = () => {
  const { debts, addDebt, payDebt, deleteDebt, accounts, hideBalance } = useApp();

  const [activeTab, setActiveTab] = useState<'lent' | 'borrowed'>('lent');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDebtForPayment, setSelectedDebtForPayment] = useState<Debt | null>(null);

  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const [paymentAmount, setPaymentAmount] = useState('');
  const [linkedAccountId, setLinkedAccountId] = useState(accounts[0]?.id || '');

  const filteredDebts = debts.filter(d => d.type === activeTab);

  const totalLentRemaining = debts
    .filter(d => d.type === 'lent' && !d.completed)
    .reduce((sum, d) => sum + (d.amount - d.paidAmount), 0);

  const totalBorrowedRemaining = debts
    .filter(d => d.type === 'borrowed' && !d.completed)
    .reduce((sum, d) => sum + (d.amount - d.paidAmount), 0);

  const handleCreateDebt = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!personName.trim() || !parsedAmount || parsedAmount <= 0) return;

    addDebt({
      type: activeTab,
      personName: personName.trim(),
      amount: parsedAmount,
      currency: 'UZS',
      date: new Date().toISOString().split('T')[0],
      dueDate: dueDate || undefined,
      notes: notes.trim() || undefined
    });

    setPersonName('');
    setAmount('');
    setDueDate('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDebtForPayment) return;
    const parsed = parseFloat(paymentAmount);
    if (!parsed || parsed <= 0) return;

    payDebt(selectedDebtForPayment.id, parsed, linkedAccountId || undefined);
    setPaymentAmount('');
    setSelectedDebtForPayment(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">
            Qarzlar daftari
          </h1>
          <p className="text-xs text-zinc-500">
            Nasiyalar va majburiyatlar nazorati
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Yangi qarz</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div 
          onClick={() => setActiveTab('lent')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-colors ${
            activeTab === 'lent' 
              ? 'bg-[#121215] border-zinc-700' 
              : 'bg-zinc-900/30 border-zinc-850 opacity-60'
          }`}
        >
          <p className="text-[11px] text-zinc-500">Berilgan qarzlar (Menga qaytarishadi)</p>
          <p className="text-base font-semibold text-emerald-400 font-mono mt-0.5">
            {formatCurrency(totalLentRemaining, 'UZS', hideBalance)}
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('borrowed')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-colors ${
            activeTab === 'borrowed' 
              ? 'bg-[#121215] border-zinc-700' 
              : 'bg-zinc-900/30 border-zinc-850 opacity-60'
          }`}
        >
          <p className="text-[11px] text-zinc-500">Olingan qarzlar (Men qaytarishim kerak)</p>
          <p className="text-base font-semibold text-zinc-300 font-mono mt-0.5">
            {formatCurrency(totalBorrowedRemaining, 'UZS', hideBalance)}
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-0.5 bg-zinc-900 rounded-lg border border-zinc-800 max-w-xs text-xs">
        <button
          onClick={() => setActiveTab('lent')}
          className={`flex-1 py-1 rounded-md font-medium transition-colors ${
            activeTab === 'lent' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Qarz berdim ({debts.filter(d => d.type === 'lent').length})
        </button>
        <button
          onClick={() => setActiveTab('borrowed')}
          className={`flex-1 py-1 rounded-md font-medium transition-colors ${
            activeTab === 'borrowed' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Qarz oldim ({debts.filter(d => d.type === 'borrowed').length})
        </button>
      </div>

      {/* Debts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredDebts.length === 0 ? (
          <div className="col-span-full text-center py-12 text-xs text-zinc-600">
            Qarz yozuvlari mavjud emas.
          </div>
        ) : (
          filteredDebts.map(debt => {
            const remaining = Math.max(0, debt.amount - debt.paidAmount);
            const percentage = Math.min(Math.round((debt.paidAmount / debt.amount) * 100), 100);

            return (
              <div 
                key={debt.id}
                className="p-4 rounded-xl bg-[#121215] border border-zinc-800/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-xs font-semibold text-zinc-200">{debt.personName}</h3>
                      <p className="text-[10px] text-zinc-500 font-mono">{formatDateUz(debt.date)}</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                        {debt.completed ? "Yopilgan" : "Faol"}
                      </span>
                      <button
                        onClick={() => {
                          if (window.confirm("O'chirilsinmi?")) {
                            deleteDebt(debt.id);
                          }
                        }}
                        className="p-1 text-zinc-600 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {debt.notes && (
                    <p className="text-[11px] text-zinc-400 bg-zinc-900/60 p-2 rounded-lg mb-2.5">
                      {debt.notes}
                    </p>
                  )}

                  <div className="space-y-1 mt-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500">Jami summa:</span>
                      <span className="text-zinc-200">{formatCurrency(debt.amount, debt.currency, hideBalance)}</span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-zinc-400 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-0.5">
                      <span>To'langan: {percentage}%</span>
                      <span>{debt.completed ? "Yopildi" : `Qoldiq: ${formatCurrency(remaining, debt.currency, hideBalance)}`}</span>
                    </div>
                  </div>
                </div>

                {!debt.completed && (
                  <div className="mt-3 pt-2.5 border-t border-zinc-850">
                    <button
                      onClick={() => {
                        setSelectedDebtForPayment(debt);
                        setPaymentAmount(remaining.toString());
                      }}
                      className="w-full py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors"
                    >
                      {debt.type === 'lent' ? "Qaytgan pulni kiritish" : "Qarzni to'lash"}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-[#121215] border border-zinc-800 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-100">
              {activeTab === 'lent' ? "Yangi berilgan qarz" : "Yangi olingan qarz"}
            </h3>

            <form onSubmit={handleCreateDebt} className="space-y-3">
              <div>
                <label className="text-[11px] text-zinc-400">Shaxs nomi:</label>
                <input
                  type="text"
                  required
                  placeholder="Ism..."
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400">Summa (so'm):</label>
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
                <label className="text-[11px] text-zinc-400">Muddati (ixtiyoriy):</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400">Izoh:</label>
                <input
                  type="text"
                  placeholder="Izoh..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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

      {/* Payment Modal */}
      {selectedDebtForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-[#121215] border border-zinc-800 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-100">
              {selectedDebtForPayment.personName} — To'lov
            </h3>

            <form onSubmit={handlePaymentSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] text-zinc-400">To'lanayotgan summa:</label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  autoFocus
                  className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-sm outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400">Bog'langan hisob:</label>
                <select
                  value={linkedAccountId}
                  onChange={(e) => setLinkedAccountId(e.target.value)}
                  className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 outline-none mt-1"
                >
                  <option value="">Hisob balansiga ta'sir qilmasin</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedDebtForPayment(null)}
                  className="flex-1 py-2 rounded-lg bg-zinc-900 text-zinc-400 text-xs hover:text-white"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-emerald-500 text-zinc-950 font-semibold text-xs hover:bg-emerald-400"
                >
                  Tasdiqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
