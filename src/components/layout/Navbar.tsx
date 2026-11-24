import React from 'react';
import { 
  Eye, 
  EyeOff, 
  Plus, 
  Menu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDateUz } from '../../utils/formatters';

interface NavbarProps {
  onOpenAddModal: (type?: 'expense' | 'income') => void;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenAddModal, 
  onToggleMobileMenu 
}) => {
  const { totalBalanceInUZS, hideBalance, setHideBalance } = useApp();
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <header className="sticky top-0 z-30 bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            aria-label="Menyu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
              M
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-zinc-100">
                MoneyTracker
              </span>
              <p className="text-[11px] text-zinc-500 hidden sm:block">Shaxsiy moliya boshqaruvi</p>
            </div>
          </div>
        </div>

        {/* Center: Clean Balance summary */}
        <div className="hidden md:flex items-center gap-4 px-3.5 py-1.5 rounded-xl bg-zinc-900/60 border border-zinc-800/70">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400">Jami balans:</span>
            <span className="font-semibold text-zinc-100 tracking-tight font-mono">
              {formatCurrency(totalBalanceInUZS, 'UZS', hideBalance)}
            </span>
            <button 
              onClick={() => setHideBalance(prev => !prev)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5 ml-0.5"
              title={hideBalance ? "Ko'rsatish" : "Yashirish"}
            >
              {hideBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <span className="text-zinc-700">|</span>
          <span className="text-[11px] text-zinc-500">{formatDateUz(todayStr)}</span>
        </div>

        {/* Right: Clean Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAddModal('expense')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium border border-zinc-800 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>- Xarajat</span>
          </button>

          <button
            onClick={() => onOpenAddModal('income')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Daromad</span>
          </button>
        </div>

      </div>
    </header>
  );
};
