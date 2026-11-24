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
import { TransactionType } from './types';

const MainApp: React.FC = () => {
  const { activeTab } = useApp();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TransactionType>('expense');

  const handleOpenAddModal = (type: TransactionType = 'expense') => {
    setModalType(type);
    setAddModalOpen(true);
  };

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
