import React, { useState } from 'react';
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

const MainApp: React.FC = () => {
  const { activeTab, user, authLoading } = useApp();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TransactionType>('expense');

  const handleOpenAddModal = (type: TransactionType = 'expense') => {
    setModalType(type);
    setAddModalOpen(true);
  };

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

        {/* Main Content Area (with bottom padding for mobile bar) */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 pb-28 lg:pb-8 overflow-y-auto max-w-5xl w-full">
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
