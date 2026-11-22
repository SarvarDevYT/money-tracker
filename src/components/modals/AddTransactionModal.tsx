import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TransactionType, CurrencyType } from '../../types';
import { IconRenderer } from '../common/IconRenderer';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'expense'
}) => {
  const { categories, accounts, addTransaction } = useApp();

  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<CurrencyType>('UZS');
  const [categoryId, setCategoryId] = useState<string>('');
  const [accountId, setAccountId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setType(defaultType);
      setAmount('');
      const now = new Date();
      setDate(now.toISOString().split('T')[0]);
      setTime(now.toTimeString().slice(0, 5));
      setDescription('');

      if (accounts.length > 0) {
        setAccountId(accounts[0].id);
        setCurrency(accounts[0].currency);
      }
    }
  }, [isOpen, defaultType, accounts]);

  const availableCategories = categories.filter(c => c.type === type);

  useEffect(() => {
    if (availableCategories.length > 0 && (!categoryId || !availableCategories.find(c => c.id === categoryId))) {
      setCategoryId(availableCategories[0].id);
    }
  }, [type, availableCategories, categoryId]);

  const handleAccountChange = (accId: string) => {
    setAccountId(accId);
    const acc = accounts.find(a => a.id === accId);
    if (acc) {
      setCurrency(acc.currency);
    }
  };

  const handleQuickAddAmount = (addValue: number) => {
    const current = parseFloat(amount.replace(/\s/g, '')) || 0;
    setAmount((current + addValue).toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount.replace(/\s/g, ''));
    if (!parsedAmount || parsedAmount <= 0) return;
    if (!categoryId || !accountId) return;

    addTransaction({
      type,
      amount: parsedAmount,
      currency,
      categoryId,
      accountId,
      date: date || new Date().toISOString().split('T')[0],
      time: time || '12:00',
      description: description.trim()
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md rounded-2xl bg-[#121215] border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 pb-3 border-b border-zinc-850 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-100">
            {type === 'expense' ? "Xarajat kiritish" : "Daromad kiritish"}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 p-0.5 bg-zinc-900 rounded-lg border border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-1.5 rounded-md font-medium transition-colors ${
                type === 'expense'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Xarajat
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-1.5 rounded-md font-medium transition-colors ${
                type === 'income'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Daromad
            </button>
          </div>

          {/* Amount Input */}
          <div className="space-y-1">
            <label className="text-[11px] text-zinc-400">Summa</label>
            <div className="relative">
              <input
                type="number"
                step="any"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                className="w-full pl-3 pr-20 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-xl outline-none focus:border-zinc-700"
              />
              <div className="absolute right-2 top-2 bottom-2 flex items-center">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyType)}
                  className="bg-zinc-800 text-xs text-zinc-200 rounded px-2 py-1 outline-none cursor-pointer"
                >
                  <option value="UZS">UZS</option>
                  <option value="USD">USD</option>
                  <option value="RUB">RUB</option>
                </select>
              </div>
            </div>

            {/* Quick Amount Buttons */}
            {currency === 'UZS' && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[50000, 100000, 200000, 500000, 1000000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAddAmount(val)}
                    className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] text-zinc-400 border border-zinc-800 transition-colors"
                  >
                    +{(val / 1000).toLocaleString()} ming
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Picker */}
          <div className="space-y-1">
            <label className="text-[11px] text-zinc-400">Kategoriya</label>
            <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-0.5">
              {availableCategories.map(cat => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`p-2 rounded-lg flex items-center gap-2 text-left text-xs transition-colors border ${
                      isSelected
                        ? 'bg-zinc-800 border-zinc-650 text-white font-medium'
                        : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <IconRenderer name={cat.icon} className="w-3.5 h-3.5 shrink-0 text-zinc-300" />
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Account Selector */}
          <div className="space-y-1">
            <label className="text-[11px] text-zinc-400">Hisob / Hamyon</label>
            <div className="grid grid-cols-2 gap-2">
              {accounts.map(acc => {
                const isSelected = accountId === acc.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleAccountChange(acc.id)}
                    className={`p-2 rounded-lg text-left text-xs transition-colors border ${
                      isSelected
                        ? 'bg-zinc-800 border-zinc-650 text-white font-medium'
                        : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <p className="truncate font-medium">{acc.name}</p>
                    <p className="text-[10px] text-zinc-500 font-mono">{acc.currency}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-zinc-400">Sana</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 outline-none mt-1"
              />
            </div>

            <div>
              <label className="text-[11px] text-zinc-400">Vaqt</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 outline-none mt-1"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] text-zinc-400">Izoh</label>
            <input
              type="text"
              placeholder="Masalan: Tushlik yoki Xarid..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 outline-none mt-1"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-colors"
            >
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
