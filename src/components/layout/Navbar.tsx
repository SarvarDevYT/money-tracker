import React from 'react';
import { 
  Eye, 
  EyeOff, 
  Plus,
  Cloud,
  LogOut,
  User as UserIcon,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDateUz } from '../../utils/formatters';
import { Logo } from '../common/Logo';

interface NavbarProps {
  onOpenAddModal: (type?: 'expense' | 'income') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenAddModal
}) => {
  const { 
    totalBalanceInUZS, 
    hideBalance, 
    setHideBalance,
    user,
    setIsAuthModalOpen,
    signOut,
    isCloudSyncing
  } = useApp();
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <header className="sticky top-0 z-30 bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-6 lg:px-8 pt-safe pb-2.5 sm:py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Brand */}
        <Logo size="sm" withText />

        {/* Center: Desktop Balance Summary */}
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

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile eye button */}
          <button 
            onClick={() => setHideBalance(prev => !prev)}
            className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-zinc-200 border border-zinc-800/90 bg-zinc-900/80 active:scale-95 transition-all"
            title={hideBalance ? "Balansni ko'rsatish" : "Balansni yashirish"}
          >
            {hideBalance ? <EyeOff className="w-4 h-4 text-emerald-400" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Desktop quick action buttons (hidden on mobile to prevent crowding) */}
          <button
            onClick={() => onOpenAddModal('expense')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium border border-zinc-800 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Xarajat</span>
          </button>

          <button
            onClick={() => onOpenAddModal('income')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Daromad</span>
          </button>
        </div>

      </div>
    </header>
  );
};
