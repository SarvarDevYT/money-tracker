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
    <header className="sticky top-0 z-30 bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800/80 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
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

        {/* Right: Cloud Sync & Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Cloud Status / Auth Button */}
          {user ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <Cloud className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-pulse' : ''}`} />
              <span className="max-w-[100px] sm:max-w-[130px] truncate hidden xs:inline text-[11px]">
                {user.email?.split('@')[0]}
              </span>
              <button
                onClick={() => signOut()}
                className="p-0.5 hover:text-rose-400 transition-colors ml-0.5"
                title="Chiqish"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
              title="Bulutli saqlashni yoqish uchun tizimga kiring"
            >
              <Cloud className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-[11px]">Bulutga ulash</span>
            </button>
          )}

          {/* Mobile eye button */}
          <button 
            onClick={() => setHideBalance(prev => !prev)}
            className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 border border-zinc-800 bg-zinc-900/80"
            title={hideBalance ? "Ko'rsatish" : "Yashirish"}
          >
            {hideBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => onOpenAddModal('expense')}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-[11px] sm:text-xs font-medium border border-zinc-800 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Xarajat</span>
          </button>

          <button
            onClick={() => onOpenAddModal('income')}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-[11px] sm:text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Daromad</span>
          </button>
        </div>

      </div>
    </header>
  );
};
