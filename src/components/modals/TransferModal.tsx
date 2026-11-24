import React, { useState } from 'react';
import { X, ArrowDownUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose }) => {
  const { accounts, transferFunds, hideBalance } = useApp();

  const [fromAccountId, setFromAccountId] = useState<string>(accounts[0]?.id || '');
  const [toAccountId, setToAccountId] = useState<string>(accounts[1]?.id || accounts[0]?.id || '');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const fromAcc = accounts.find(a => a.id === fromAccountId);
  const toAcc = accounts.find(a => a.id === toAccountId);

  const handleSwap = () => {
    const temp = fromAccountId;
    setFromAccountId(toAccountId);
    setToAccountId(temp);
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setErrorMessage("Iltimos, to'g'ri o'tkazma summasini kiriting!");
      return;
    }

    if (fromAccountId === toAccountId) {
      setErrorMessage("Chiqim va kirim hisoblari bir xil bo'lishi mumkin emas!");
      return;
    }

    transferFunds(fromAccountId, toAccountId, parsedAmount, note);
    onClose();
  };

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString());
  };

  const isFromNegative = (fromAcc?.balance || 0) < 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-sm rounded-2xl bg-[#121215] border border-zinc-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 pb-3 border-b border-zinc-850 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">
              Hisoblar o'rtasida o'tkazma
            </h2>
            <p className="text-[11px] text-zinc-500">
              Kartadan naqd pulga yoki aksincha
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* From Account */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-medium text-zinc-400">Qaysi hisobdan (Chiqim):</label>
              {fromAcc && (
                <span className={`text-[11px] font-mono font-medium ${fromAcc.balance < 0 ? 'text-rose-400' : 'text-zinc-400'}`}>
                  Qoldiq: {formatCurrency(fromAcc.balance, fromAcc.currency, hideBalance)}
                </span>
              )}
            </div>
            <select
              value={fromAccountId}
              onChange={(e) => {
                setFromAccountId(e.target.value);
                setErrorMessage('');
              }}
              className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 outline-none focus:border-zinc-700"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({formatCurrency(acc.balance, acc.currency, hideBalance)})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-1">
            <button
              type="button"
              onClick={handleSwap}
              className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white text-xs transition-colors flex items-center gap-1 px-3 shadow-sm"
              title="Hisoblar yo'nalishini almashtirish"
            >
              <ArrowDownUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px]">Yo'nalishni almashtirish</span>
            </button>
          </div>

          {/* To Account */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-medium text-zinc-400">Qaysi hisobga (Kirim):</label>
              {toAcc && (
                <span className={`text-[11px] font-mono font-medium ${toAcc.balance < 0 ? 'text-rose-400' : 'text-zinc-400'}`}>
                  Qoldiq: {formatCurrency(toAcc.balance, toAcc.currency, hideBalance)}
                </span>
              )}
            </div>
            <select
              value={toAccountId}
              onChange={(e) => {
                setToAccountId(e.target.value);
                setErrorMessage('');
              }}
              className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 outline-none focus:border-zinc-700"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({formatCurrency(acc.balance, acc.currency, hideBalance)})
                </option>
              ))}
            </select>
          </div>

          {/* Negative Balance Notice */}
          {isFromNegative && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Tanlangan hisob balansi manfiy ({formatCurrency(fromAcc?.balance || 0, fromAcc?.currency || 'UZS', hideBalance)})</span>
              </div>
              <p className="text-zinc-400 text-[10px] leading-relaxed">
                Kartadan xarajatlar kiritilgan, lekin boshlang'ich karta balansi kiritilmagan bo'lsa hisob minusga tushadi. Asosiy ekrandagi <b>"Balansni kiritish"</b> tugmasi orqali haqiqiy summangizni o'rnatishingiz mumkin.
              </p>
            </div>
          )}

          {/* Amount */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-medium text-zinc-400">Summa ({fromAcc?.currency}):</label>
              {fromAcc && fromAcc.balance > 0 && (
                <button
                  type="button"
                  onClick={() => handleQuickAmount(fromAcc.balance)}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300"
                >
                  Hammasi ({formatCurrency(fromAcc.balance, fromAcc.currency, hideBalance)})
                </button>
              )}
            </div>
            <input
              type="number"
              step="any"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrorMessage('');
              }}
              className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-base outline-none focus:border-zinc-700 mt-1"
            />

            {/* Quick amount chips */}
            <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto no-scrollbar">
              {[50000, 100000, 500000, 1000000].map((quickVal) => (
                <button
                  key={quickVal}
                  type="button"
                  onClick={() => handleQuickAmount(quickVal)}
                  className="px-2 py-1 rounded-md bg-zinc-850 hover:bg-zinc-800 text-[10px] text-zinc-300 font-mono border border-zinc-800 whitespace-nowrap transition-colors"
                >
                  +{quickVal.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {fromAcc && toAcc && fromAcc.currency !== toAcc.currency && (
            <p className="text-[11px] text-zinc-500">
              Valyuta kursi bo'yicha avtomatik konvertatsiya qilinadi.
            </p>
          )}

          {/* Note */}
          <div>
            <label className="text-[11px] font-medium text-zinc-400">Izoh (ixtiyoriy):</label>
            <input
              type="text"
              placeholder="Masalan: Kartadan naqd yechildi..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-700 mt-1"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition-colors shadow-sm"
            >
              O'tkazmani tasdiqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
