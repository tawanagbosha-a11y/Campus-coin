import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileNav } from './components/common/MobileNav';
import { MoreMenuModal } from './components/common/MoreMenuModal';
import { LandingPage } from './components/public/LandingPage';
import { AboutPage } from './components/public/AboutPage';
import { StudentsPage } from './components/public/StudentsPage';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { TransactionManager } from './components/transactions/TransactionManager';
import { TransactionModal } from './components/transactions/TransactionModal';
import { BudgetManager } from './components/budget/BudgetManager';
import { GoalsManager } from './components/goals/GoalsManager';
import { ContributeModal } from './components/goals/ContributeModal';
import { SemesterPlanner } from './components/semester/SemesterPlanner';
import { InsightsView } from './components/insights/InsightsView';
import { CampusDeals } from './components/deals/CampusDeals';
import { FinancialWellness } from './components/wellness/FinancialWellness';
import { StudentProfile } from './components/profile/StudentProfile';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UpgradeModal } from './components/premium/UpgradeModal';
import { AuthPages } from './components/auth/AuthPages';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Transaction } from './types';

const MainApp: React.FC = () => {
  const { activeView, setActiveView, isAuthenticated } = useAuth();

  // Modal states
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [contributeGoalId, setContributeGoalId] = useState<string | null>(null);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const handleOpenAddTx = () => {
    setEditingTransaction(null);
    setIsAddTxOpen(true);
  };

  const handleEditTx = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsAddTxOpen(true);
  };

  const handleOpenContributeGoal = (goalId: string) => {
    setContributeGoalId(goalId);
  };

  // Render current view
  const renderViewContent = () => {
    switch (activeView) {
      case 'home':
      case 'features':
      case 'pricing':
      case 'how_it_works':
      case 'faq':
      case 'contact':
        return <LandingPage />;

      case 'about':
        return <AboutPage />;

      case 'students':
        return <StudentsPage />;

      case 'login':
        return <AuthPages mode="login" />;

      case 'register':
        return <AuthPages mode="register" />;

      case 'dashboard':
        return (
          <StudentDashboard
            onOpenAddTx={handleOpenAddTx}
            onOpenContributeGoal={handleOpenContributeGoal}
            onOpenUpgrade={() => setIsUpgradeOpen(true)}
          />
        );

      case 'transactions':
        return (
          <TransactionManager
            onOpenAddModal={handleOpenAddTx}
            onEditTransaction={handleEditTx}
          />
        );

      case 'budget':
        return <BudgetManager />;

      case 'goals':
        return (
          <GoalsManager
            onOpenContributeModal={handleOpenContributeGoal}
          />
        );

      case 'semester':
        return <SemesterPlanner />;

      case 'insights':
        return <InsightsView />;

      case 'deals':
        return <CampusDeals />;

      case 'wellness':
        return <FinancialWellness />;

      case 'profile':
        return <StudentProfile onOpenUpgrade={() => setIsUpgradeOpen(true)} />;

      case 'admin':
        return <AdminDashboard />;

      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <Navbar
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
        onOpenAddTx={handleOpenAddTx}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-24 md:pb-8">
        {renderViewContent()}
      </main>

      {/* Institutional Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileNav
        onOpenAddTx={handleOpenAddTx}
        onOpenMore={() => setIsMoreMenuOpen(true)}
      />

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={isAddTxOpen}
        onClose={() => {
          setIsAddTxOpen(false);
          setEditingTransaction(null);
        }}
        editingTransaction={editingTransaction}
      />

      {/* Goal Contribution Modal */}
      <ContributeModal
        goalId={contributeGoalId}
        onClose={() => setContributeGoalId(null)}
      />

      {/* Upgrade to Campus Coin Plus Modal */}
      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />

      {/* Mobile More Drawer */}
      <MoreMenuModal
        isOpen={isMoreMenuOpen}
        onClose={() => setIsMoreMenuOpen(false)}
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
      />
    </div>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
