import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ReceiptText, 
  Plus, 
  PieChart, 
  MoreHorizontal,
  AlertCircle,
  Target,
  HandCoins,
  Repeat,
  Settings,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BottomNavProps {
  onOpenAddModal: (type?: 'expense' | 'income') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenAddModal }) => {
  const { activeTab, setActiveTab, debts, goals } = useApp();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const pendingDebts = debts.filter(d => !d.completed).length;

  const moreItems = [
    { id: 'budgets', label: 'Byudjet limitlari', icon: AlertCircle },
    { id: 'goals', label: 'Maqsadlar (Jamg\'arma)', icon: Target, badge: goals.length },
    { id: 'debts', label: 'Qarzlar daftari', icon: HandCoins, badge: pendingDebts > 0 ? pendingDebts : undefined },
    { id: 'subscriptions', label: 'Doimiy to\'lovlar', icon: Repeat },
    { id: 'settings', label: 'Sozlamalar va zaxira', icon: Settings },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    setIsMoreOpen(false);
  };

  const isMoreActive = ['budgets', 'goals', 'debts', 'subscriptions', 'settings'].includes(activeTab);

  return (
    <>
      {/* Mobile More Sheet / Drawer */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setIsMoreOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          {/* Sheet */}
          <div className="fixed bottom-0 left-0 right-0 bg-[#121215] border-t border-zinc-800 rounded-t-2xl p-5 pb-8 space-y-4 animate-fadeIn z-10 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-850">
              <span className="text-sm font-semibold text-zinc-200">Boshqa bo'limlar</span>
              <button 
                onClick={() => setIsMoreOpen(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {moreItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`p-3 rounded-xl flex items-center justify-between text-left transition-colors border ${
                      isActive 
                        ? 'bg-zinc-800 border-zinc-700 text-white font-medium' 
                        : 'bg-zinc-900/80 border-zinc-800/80 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className="w-4 h-4 shrink-0 text-zinc-400" />
                      <span className="text-xs truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-zinc-800 text-zinc-400 border border-zinc-700">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Navigation Bar (Visible only on mobile/tablet screens < lg) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#0c0c0e]/95 backdrop-blur-lg border-t border-zinc-800/80 px-2 py-1.5 pb-safe">
        <div className="max-w-md mx-auto flex items-center justify-around">
          
          {/* 1. Dashboard */}
          <button
            onClick={() => handleSelectTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors ${
              activeTab === 'dashboard' ? 'text-emerald-400 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Asosiy</span>
          </button>

          {/* 2. Transactions */}
          <button
            onClick={() => handleSelectTab('transactions')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors ${
              activeTab === 'transactions' ? 'text-emerald-400 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <ReceiptText className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Tarix</span>
          </button>

          {/* 3. Center Quick Add Button (Prominent Touch Target) */}
          <button
            onClick={() => onOpenAddModal('expense')}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold shadow-lg shadow-emerald-500/25 active:scale-95 transition-transform -mt-3 border-2 border-[#0c0c0e]"
            aria-label="Yangi xarajat yoki daromad qo'shish"
          >
            <Plus className="w-6 h-6" />
          </button>

          {/* 4. Analytics */}
          <button
            onClick={() => handleSelectTab('analytics')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors ${
              activeTab === 'analytics' ? 'text-emerald-400 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <PieChart className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Tahlil</span>
          </button>

          {/* 5. More Menu */}
          <button
            onClick={() => setIsMoreOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors relative ${
              isMoreActive ? 'text-emerald-400 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Ko'proq</span>
            {pendingDebts > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

        </div>
      </nav>
    </>
  );
};
