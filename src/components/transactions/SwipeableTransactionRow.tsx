import React, { useState, useRef } from 'react';
import { Trash2, ArrowRightLeft } from 'lucide-react';
import { Transaction, Category, Account } from '../../types';
import { formatCurrency, formatDateUz } from '../../utils/formatters';
import { IconRenderer } from '../common/IconRenderer';

interface SwipeableTransactionRowProps {
  tx: Transaction;
  category?: Category;
  account?: Account;
  toAccount?: Account | null;
  hideBalance: boolean;
  onDelete: (id: string) => void;
}

const ACTION_WIDTH = 76;

export const SwipeableTransactionRow: React.FC<SwipeableTransactionRowProps> = ({
  tx,
  category,
  account,
  toAccount,
  hideBalance,
  onDelete,
}) => {
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const touchStart = useRef<{ x: number; y: number; baseOffset: number; locked: 'x' | 'y' | null } | null>(null);

  const isIncome = tx.type === 'income';
  const isTransfer = tx.type === 'transfer';

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      baseOffset: offsetX,
      locked: null,
    };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;

    if (!touchStart.current.locked) {
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        touchStart.current.locked = 'x';
      } else if (Math.abs(dy) > 8) {
        touchStart.current.locked = 'y';
      }
    }

    if (touchStart.current.locked === 'x') {
      e.stopPropagation();
      const next = Math.max(-ACTION_WIDTH, Math.min(0, touchStart.current.baseOffset + dx));
      setOffsetX(next);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart.current) return;
    if (touchStart.current.locked === 'x') {
      if (offsetX < -ACTION_WIDTH / 2) {
        setOffsetX(-ACTION_WIDTH);
      } else {
        setOffsetX(0);
      }
    }
    touchStart.current = null;
    setIsDragging(false);
  };

  const handleConfirmDelete = () => {
    if (window.confirm("O'chirilsinmi?")) {
      onDelete(tx.id);
    } else {
      setOffsetX(0);
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#121215] no-swipe">
      {/* Revealed Delete Action Behind Row */}
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-center bg-rose-600/90 hover:bg-rose-600 text-white transition-opacity"
        style={{ width: `${ACTION_WIDTH}px`, opacity: offsetX < -4 ? 1 : 0 }}
      >
        <button
          type="button"
          onClick={handleConfirmDelete}
          className="w-full h-full flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium active:scale-95 transition-transform"
          aria-label="O'chirish"
        >
          <Trash2 className="w-4 h-4" />
          <span>O'chirish</span>
        </button>
      </div>

      {/* Foreground Sliding Row */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          if (offsetX < 0) setOffsetX(0);
        }}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="relative z-10 bg-[#121215] p-3 sm:p-3.5 flex items-center justify-between gap-2.5 sm:gap-3 group hover:bg-zinc-900/40"
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
            isTransfer 
              ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' 
              : isIncome 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-300'
          }`}>
            {isTransfer ? (
              <ArrowRightLeft className="w-4 h-4" />
            ) : (
              <IconRenderer name={category?.icon || 'CircleDot'} className="w-4 h-4" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-medium text-zinc-200 truncate">
                {isTransfer ? "Hisoblar o'rtasida o'tkazma" : (category?.name || 'Kategoriya')}
              </p>
              <span className="text-[10px] text-zinc-500 truncate">
                • {isTransfer ? `${account?.name} ➔ ${toAccount?.name || 'Boshqa hisob'}` : account?.name}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 truncate mt-0.5">
              {tx.description || "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="text-right">
            <p className={`text-xs sm:text-sm font-semibold font-mono ${
              isIncome 
                ? 'text-emerald-400' 
                : isTransfer 
                  ? 'text-sky-400' 
                  : 'text-zinc-200'
            }`}>
              {isIncome ? '+' : isTransfer ? '⇄ ' : '-'}{formatCurrency(tx.amount, tx.currency, hideBalance)}
            </p>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
              {formatDateUz(tx.date)}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleConfirmDelete();
            }}
            className="hidden sm:inline-flex p-1.5 text-zinc-600 hover:text-rose-400 transition-colors"
            title="O'chirish"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
