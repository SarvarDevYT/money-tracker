import React, { useState, useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { RefreshCw } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { BalanceCard } from './components/dashboard/BalanceCard';
import { QuickStats } from './components/dashboard/QuickStats';
import { RecentTransactions } from './components/dashboard/RecentTransactions';
import { BudgetProgressWidget } from './components/dashboard/BudgetProgressWidget';
import { TransactionList } from './components/transactions/TransactionList';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { BudgetManager } from './components/budgets/BudgetManager';
import { GoalsView } from './components/goals/GoalsView';
import { DebtsView } from './components/debts/DebtsView';
import { SubscriptionsView } from './components/subscriptions/SubscriptionsView';
import { SettingsView } from './components/settings/SettingsView';
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { TermsOfService } from './components/legal/TermsOfService';
import { AuthCallback } from './components/auth/AuthCallback';
import { Logo } from './components/common/Logo';
import { TransactionType } from './types';

const SWIPE_TABS = ['dashboard', 'transactions', 'analytics'] as const;

const MainApp: React.FC = () => {
  const { activeTab, setActiveTab, user, authLoading, refreshCurrencyRates } = useApp();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TransactionType>('expense');
  const [slideDir, setSlideDir] = useState<'left' | 'right' | null>(null);
  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const mainTouchRef = useRef<{
    x: number;
    y: number;
    atTop: boolean;
    ignored: boolean;
  } | null>(null);
  const prevTabRef = useRef(activeTab);

  useEffect(() => {
    if (prevTabRef.current !== activeTab) {
      const prevIdx = SWIPE_TABS.indexOf(prevTabRef.current as any);
      const nextIdx = SWIPE_TABS.indexOf(activeTab as any);
      if (prevIdx !== -1 && nextIdx !== -1) {
        setSlideDir(nextIdx > prevIdx ? 'right' : 'left');
      } else {
        setSlideDir('right');
      }
      prevTabRef.current = activeTab;
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [activeTab]);

  const handleMainTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    const ignored = Boolean(
      target.closest('.no-swipe, .overflow-x-auto, .recharts-wrapper, input, select, textarea')
    );
    const touch = e.touches[0];
    mainTouchRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      atTop: window.scrollY <= 2,
      ignored,
    };
  };

  const handleMainTouchMove = (e: React.TouchEvent) => {
    if (!mainTouchRef.current || mainTouchRef.current.ignored || isRefreshing) return;
    const touch = e.touches[0];
    const dx = touch.clientX - mainTouchRef.current.x;
    const dy = touch.clientY - mainTouchRef.current.y;

    // Pull-to-refresh only when strictly dragging down from top
    if (mainTouchRef.current.atTop && dy > 10 && Math.abs(dy) > Math.abs(dx) * 1.5 && window.scrollY <= 2) {
      setPullY(Math.min(90, dy * 0.45));
    } else if (pullY > 0) {
      setPullY(0);
    }
  };

  const handleMainTouchEnd = async (e: React.TouchEvent) => {
    if (!mainTouchRef.current) return;
    const { x, y, ignored } = mainTouchRef.current;
    mainTouchRef.current = null;

    // Handle Pull-to-refresh release
    if (pullY >= 60 && !isRefreshing) {
      setIsRefreshing(true);
      setPullY(52);
      try {
        await refreshCurrencyRates();
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          setPullY(0);
        }, 350);
      }
      return;
    }
    setPullY(0);

    if (ignored || addModalOpen) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - x;
    const dy = touch.clientY - y;

    // Intentional horizontal swipe threshold
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.8) {
      const currentIndex = SWIPE_TABS.indexOf(activeTab as any);
      if (currentIndex !== -1) {
        if (dx < 0 && currentIndex < SWIPE_TABS.length - 1) {
          setActiveTab(SWIPE_TABS[currentIndex + 1]);
        } else if (dx > 0 && currentIndex > 0) {
          setActiveTab(SWIPE_TABS[currentIndex - 1]);
        }
      } else if (dx > 0) {
        // Sub-pages (budgets, goals, debts, subscriptions, settings): swipe right returns to dashboard
        setActiveTab('dashboard');
      }
    }
  };

  const handleOpenAddModal = (type: TransactionType = 'expense') => {
    setModalType(type);
    setAddModalOpen(true);
  };

  // Configure Native Status Bar so it does not overlay content
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      try {
        StatusBar.setStyle({ style: Style.Dark });
        StatusBar.setBackgroundColor({ color: '#09090b' });
        StatusBar.setOverlaysWebView({ overlay: false });
      } catch (err) {
        console.error('StatusBar setup error:', err);
      }
    }
  }, []);

  // Public Legal Pages (accessible without authentication)
  const currentPath = window.location.pathname.toLowerCase();
  const currentHash = window.location.hash.toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);
  const viewParam = searchParams.get('view')?.toLowerCase();

  if (currentPath === '/privacy' || currentHash === '#privacy' || viewParam === 'privacy') {
    return <PrivacyPolicy />;
  }

  if (currentPath === '/terms' || currentHash === '#terms' || viewParam === 'terms') {
    return <TermsOfService />;
  }

  if (currentPath === '/auth-callback' || currentPath.startsWith('/auth-callback') || currentHash.startsWith('#auth-callback')) {
    return <AuthCallback />;
  }

  // 1. Initial loading screen while checking session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4">
        <Logo size="lg" className="animate-pulse" />
        <p className="text-xs text-zinc-500 font-medium mt-3">Yuklanmoqda...</p>
      </div>
    );
  }

  // 2. Mandatory Authentication Gate: if user is not logged in, show AuthScreen
  if (!user) {
    return <AuthScreen />;
  }

  // 3. User is authenticated -> show full MoneyTracker application
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onOpenAddModal={handleOpenAddModal}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar (visible on lg screens) */}
        <Sidebar
          mobileOpen={false}
          onCloseMobile={() => {}}
        />

        {/* Main Content Area (with bottom padding for mobile bar & swipe gestures) */}
        <main 
          onTouchStart={handleMainTouchStart}
          onTouchMove={handleMainTouchMove}
          onTouchEnd={handleMainTouchEnd}
          className="flex-1 p-3 sm:p-6 lg:p-8 pb-28 lg:pb-8 overflow-y-auto max-w-5xl w-full relative"
        >
          {/* Pull-to-refresh indicator */}
          {(pullY > 0 || isRefreshing) && (
            <div
              className="flex items-center justify-center overflow-hidden transition-all duration-150"
              style={{ height: `${pullY}px` }}
            >
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shadow-lg">
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
                  style={!isRefreshing ? { transform: `rotate(${pullY * 4}deg)` } : undefined}
                />
              </div>
            </div>
          )}

          <div
            key={activeTab}
            className={
              slideDir === 'right'
                ? 'animate-slideInRight'
                : slideDir === 'left'
                ? 'animate-slideInLeft'
                : 'animate-fadeIn'
            }
          >
            {activeTab === 'dashboard' && (
              <div className="space-y-3.5 sm:space-y-4">
                <BalanceCard 
                  onOpenAddModal={handleOpenAddModal}
                />

                <QuickStats />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-4">
                  <div className="lg:col-span-2">
                    <RecentTransactions onOpenAddModal={handleOpenAddModal} />
                  </div>
                  <div>
                    <BudgetProgressWidget />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <TransactionList onOpenAddModal={handleOpenAddModal} />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView />
            )}

            {activeTab === 'budgets' && (
              <BudgetManager />
            )}

            {activeTab === 'goals' && (
              <GoalsView />
            )}

            {activeTab === 'debts' && (
              <DebtsView />
            )}

            {activeTab === 'subscriptions' && (
              <SubscriptionsView />
            )}

            {activeTab === 'settings' && (
              <SettingsView />
            )}
          </div>
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomNav onOpenAddModal={handleOpenAddModal} />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        defaultType={modalType}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
