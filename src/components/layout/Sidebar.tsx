import React from 'react';
import { 
  LayoutDashboard, 
  ReceiptText, 
  PieChart, 
  AlertCircle, 
  Target, 
  HandCoins, 
  Repeat, 
  Settings
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC<{ mobileOpen?: boolean; onCloseMobile?: () => void }> = () => {
  const { activeTab, setActiveTab, transactions, debts, goals } = useApp();

  const pendingDebtsCount = debts.filter(d => !d.completed).length;

  const navItems = [
    { id: 'dashboard', label: 'Boshqaruv paneli', icon: LayoutDashboard },
    { id: 'transactions', label: 'Tranzaksiyalar', icon: ReceiptText, badge: transactions.length },
    { id: 'analytics', label: 'Tahlil va hisobotlar', icon: PieChart },
    { id: 'budgets', label: 'Byudjet limitlari', icon: AlertCircle },
    { id: 'goals', label: 'Maqsadlar', icon: Target, badge: goals.length },
    { id: 'debts', label: 'Qarzlar daftari', icon: HandCoins, badge: pendingDebtsCount > 0 ? pendingDebtsCount : undefined },
    { id: 'subscriptions', label: 'Doimiy to\'lovlar', icon: Repeat },
    { id: 'settings', label: 'Sozlamalar va zaxira', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col justify-between w-60 bg-[#0c0c0e] border-r border-zinc-800/80 p-3.5 shrink-0 min-h-[calc(100vh-57px)]">
      <div className="space-y-4">
        <div className="space-y-0.5">
          <p className="px-2.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            Bo'limlar
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors
                  ${isActive 
                    ? 'bg-zinc-800/90 text-white font-medium' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }
                `}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-200' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-medium bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60 text-[11px] text-zinc-500">
        <p className="font-medium text-zinc-400">Offline-first & Maxfiy</p>
        <p className="text-[10px] text-zinc-600 mt-0.5">Barcha ma'lumotlar qurilmangizda saqlanadi.</p>
      </div>
    </aside>
  );
};
