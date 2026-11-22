import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose }) => {
  const { accounts, transferFunds, hideBalance } = useApp();

  const [fromAccountId, setFromAccountId] = useState<string>(accounts[0]?.id || '');
  const [toAccountId, setToAccountId] = useState<string>(accounts[1]?.id || '');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');

  if (!isOpen) return null;

  const fromAcc = accounts.find(a => a.id === fromAccountId);
  const toAcc = accounts.find(a => a.id === toAccountId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) return;
    if (fromAccountId === toAccountId) {
      alert("Bir xil hisoblar o'rtasida o'tkazma qilib bo'lmaydi!");
      return;
    }

    transferFunds(fromAccountId, toAccountId, parsedAmount, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-sm rounded-2xl bg-[#121215] border border-zinc-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 pb-3 border-b border-zinc-850 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-100">
            Hisoblar o'rtasida o'tkazma
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="text-[11px] text-zinc-400">Qaysi hisobdan:</label>
            <select
              value={fromAccountId}
              onChange={(e) => setFromAccountId(e.target.value)}
              className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 outline-none mt-1"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({formatCurrency(acc.balance, acc.currency, hideBalance)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-zinc-400">Qaysi hisobga:</label>
            <select
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 outline-none mt-1"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({formatCurrency(acc.balance, acc.currency, hideBalance)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-zinc-400">Summa ({fromAcc?.currency}):</label>
            <input
              type="number"
              step="any"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-sm outline-none mt-1"
            />
          </div>

          {fromAcc && toAcc && fromAcc.currency !== toAcc.currency && (
            <p className="text-[11px] text-zinc-500">
              Valyuta kursi bo'yicha avtomatik konvertatsiya qilinadi.
            </p>
          )}

          <div>
            <label className="text-[11px] text-zinc-400">Izoh:</label>
            <input
              type="text"
              placeholder="Masalan: Kartadan naqd..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 outline-none mt-1"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition-colors"
            >
              O'tkazmani tasdiqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
