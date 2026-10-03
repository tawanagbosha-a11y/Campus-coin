import {
  UserProfile,
  Transaction,
  Category,
  Budget,
  SavingsGoal,
  RecurringExpense,
  SemesterPlan,
  AppNotification,
  PartnerDeal,
  PaymentTransaction,
  SubscriptionConfig,
  AuditLog,
  GoalContribution
} from '../types';

import {
  INITIAL_DEMO_USER,
  INITIAL_CATEGORIES,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGET,
  INITIAL_GOALS,
  INITIAL_RECURRING,
  INITIAL_SEMESTER_PLAN,
  INITIAL_PARTNER_DEALS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PAYMENTS,
  INITIAL_SUBSCRIPTION_CONFIG,
  INITIAL_AUDIT_LOGS
} from './initialData';

const STORAGE_KEYS = {
  USER: 'campus_coin_user',
  ALL_USERS: 'campus_coin_all_users',
  CATEGORIES: 'campus_coin_categories',
  TRANSACTIONS: 'campus_coin_transactions',
  BUDGET: 'campus_coin_budget',
  GOALS: 'campus_coin_goals',
  RECURRING: 'campus_coin_recurring',
  SEMESTER_PLAN: 'campus_coin_semester_plan',
  NOTIFICATIONS: 'campus_coin_notifications',
  PARTNER_DEALS: 'campus_coin_partner_deals',
  PAYMENTS: 'campus_coin_payments',
  SUBSCRIPTION_CONFIG: 'campus_coin_sub_config',
  AUDIT_LOGS: 'campus_coin_audit_logs'
};

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

export const StorageService = {
  // Reset everything to seed demo data
  resetDemoData: (): void => {
    setToStorage(STORAGE_KEYS.USER, INITIAL_DEMO_USER);
    setToStorage(STORAGE_KEYS.ALL_USERS, [INITIAL_DEMO_USER]);
    setToStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    setToStorage(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    setToStorage(STORAGE_KEYS.BUDGET, INITIAL_BUDGET);
    setToStorage(STORAGE_KEYS.GOALS, INITIAL_GOALS);
    setToStorage(STORAGE_KEYS.RECURRING, INITIAL_RECURRING);
    setToStorage(STORAGE_KEYS.SEMESTER_PLAN, INITIAL_SEMESTER_PLAN);
    setToStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    setToStorage(STORAGE_KEYS.PARTNER_DEALS, INITIAL_PARTNER_DEALS);
    setToStorage(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    setToStorage(STORAGE_KEYS.SUBSCRIPTION_CONFIG, INITIAL_SUBSCRIPTION_CONFIG);
    setToStorage(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  // Initialize storage if empty
  init: (): void => {
    if (!localStorage.getItem(STORAGE_KEYS.USER)) {
      StorageService.resetDemoData();
    }
  },

  // User Profile
  getCurrentUser: (): UserProfile => {
    return getFromStorage<UserProfile>(STORAGE_KEYS.USER, INITIAL_DEMO_USER);
  },

  setCurrentUser: (user: UserProfile): void => {
    setToStorage(STORAGE_KEYS.USER, user);
    // Also update in all users
    const all = StorageService.getAllUsers();
    const idx = all.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      all[idx] = user;
    } else {
      all.push(user);
    }
    setToStorage(STORAGE_KEYS.ALL_USERS, all);
  },

  getAllUsers: (): UserProfile[] => {
    return getFromStorage<UserProfile[]>(STORAGE_KEYS.ALL_USERS, [INITIAL_DEMO_USER]);
  },

  // Transactions
  getTransactions: (userId?: string): Transaction[] => {
    const list = getFromStorage<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    if (userId) return list.filter(t => t.userId === userId);
    return list;
  },

  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
    const list = StorageService.getTransactions();
    const newTx: Transaction = {
      ...tx,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newTx, ...list];
    setToStorage(STORAGE_KEYS.TRANSACTIONS, updated);

    // Update budget category spent if expense
    if (tx.type === 'expense') {
      const budget = StorageService.getBudget(tx.userId);
      if (budget) {
        const catItem = budget.categories.find(c => c.categoryName.toLowerCase() === tx.category.toLowerCase());
        if (catItem) {
          catItem.spent += tx.amount;
          StorageService.saveBudget(budget);
        }
      }
    }

    return newTx;
  },

  updateTransaction: (updatedTx: Transaction): void => {
    const list = StorageService.getTransactions();
    const updated = list.map(t => t.id === updatedTx.id ? updatedTx : t);
    setToStorage(STORAGE_KEYS.TRANSACTIONS, updated);
  },

  deleteTransaction: (id: string): void => {
    const list = StorageService.getTransactions();
    const updated = list.filter(t => t.id !== id);
    setToStorage(STORAGE_KEYS.TRANSACTIONS, updated);
  },

  // Categories
  getCategories: (): Category[] => {
    return getFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  addCategory: (cat: Omit<Category, 'id'>): Category => {
    const list = StorageService.getCategories();
    const newCat: Category = {
      ...cat,
      id: `cat_${Date.now()}`
    };
    setToStorage(STORAGE_KEYS.CATEGORIES, [...list, newCat]);
    return newCat;
  },

  // Budget
  getBudget: (userId?: string): Budget => {
    const budget = getFromStorage<Budget>(STORAGE_KEYS.BUDGET, INITIAL_BUDGET);
    // Recalculate spent dynamically based on transactions in the current month
    const txs = StorageService.getTransactions(userId || budget.userId);
    const currentMonth = new Date().toISOString().substring(0, 7); // e.g. "2026-10"

    const updatedCategories = budget.categories.map(cat => {
      const spentInCat = txs
        .filter(t => t.type === 'expense' && t.category.toLowerCase() === cat.categoryName.toLowerCase() && t.date.startsWith(currentMonth))
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        ...cat,
        spent: spentInCat > 0 ? spentInCat : cat.spent
      };
    });

    return {
      ...budget,
      month: currentMonth,
      categories: updatedCategories
    };
  },

  saveBudget: (budget: Budget): void => {
    setToStorage(STORAGE_KEYS.BUDGET, budget);
  },

  // Goals
  getGoals: (userId?: string): SavingsGoal[] => {
    const list = getFromStorage<SavingsGoal[]>(STORAGE_KEYS.GOALS, INITIAL_GOALS);
    if (userId) return list.filter(g => g.userId === userId);
    return list;
  },

  addGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'contributions'>): SavingsGoal => {
    const list = StorageService.getGoals();
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
      createdAt: new Date().toISOString(),
      contributions: []
    };
    setToStorage(STORAGE_KEYS.GOALS, [...list, newGoal]);
    return newGoal;
  },

  updateGoal: (updatedGoal: SavingsGoal): void => {
    const list = StorageService.getGoals();
    const updated = list.map(g => g.id === updatedGoal.id ? updatedGoal : g);
    setToStorage(STORAGE_KEYS.GOALS, updated);
  },

  deleteGoal: (id: string): void => {
    const list = StorageService.getGoals();
    const updated = list.filter(g => g.id !== id);
    setToStorage(STORAGE_KEYS.GOALS, updated);
  },

  contributeToGoal: (goalId: string, amount: number, note?: string): SavingsGoal | null => {
    const list = StorageService.getGoals();
    const goal = list.find(g => g.id === goalId);
    if (!goal) return null;

    const contribution: GoalContribution = {
      id: `gc_${Date.now()}`,
      goalId,
      amount,
      date: new Date().toISOString().split('T')[0],
      note
    };

    const newCurrent = goal.currentAmount + amount;
    const isCompleted = newCurrent >= goal.targetAmount;

    const updatedGoal: SavingsGoal = {
      ...goal,
      currentAmount: newCurrent,
      status: isCompleted ? 'completed' : goal.status,
      contributions: [...(goal.contributions || []), contribution]
    };

    StorageService.updateGoal(updatedGoal);

    // Also optionally record a savings expense or milestone notification
    if (isCompleted) {
      StorageService.addNotification({
        userId: goal.userId,
        type: 'goal_milestone',
        title: `Goal Achieved: ${goal.name}!`,
        message: `Congratulations! You reached your target of $${goal.targetAmount.toFixed(2)}.`,
        read: false
      });
    }

    return updatedGoal;
  },

  // Recurring Expenses
  getRecurring: (userId?: string): RecurringExpense[] => {
    const list = getFromStorage<RecurringExpense[]>(STORAGE_KEYS.RECURRING, INITIAL_RECURRING);
    if (userId) return list.filter(r => r.userId === userId);
    return list;
  },

  addRecurring: (rec: Omit<RecurringExpense, 'id'>): RecurringExpense => {
    const list = StorageService.getRecurring();
    const newRec: RecurringExpense = {
      ...rec,
      id: `rec_${Date.now()}`
    };
    setToStorage(STORAGE_KEYS.RECURRING, [...list, newRec]);
    return newRec;
  },

  deleteRecurring: (id: string): void => {
    const list = StorageService.getRecurring();
    const updated = list.filter(r => r.id !== id);
    setToStorage(STORAGE_KEYS.RECURRING, updated);
  },

  // Semester Plan
  getSemesterPlan: (userId?: string): SemesterPlan => {
    return getFromStorage<SemesterPlan>(STORAGE_KEYS.SEMESTER_PLAN, INITIAL_SEMESTER_PLAN);
  },

  saveSemesterPlan: (plan: SemesterPlan): void => {
    setToStorage(STORAGE_KEYS.SEMESTER_PLAN, plan);
  },

  // Notifications
  getNotifications: (userId?: string): AppNotification[] => {
    const list = getFromStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    if (userId) return list.filter(n => n.userId === userId);
    return list;
  },

  addNotification: (notif: Omit<AppNotification, 'id' | 'createdAt'>): AppNotification => {
    const list = StorageService.getNotifications();
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setToStorage(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...list]);
    return newNotif;
  },

  markNotificationAsRead: (id: string): void => {
    const list = StorageService.getNotifications();
    const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
    setToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  markAllNotificationsAsRead: (): void => {
    const list = StorageService.getNotifications();
    const updated = list.map(n => ({ ...n, read: true }));
    setToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  // Partner Deals
  getPartnerDeals: (): PartnerDeal[] => {
    return getFromStorage<PartnerDeal[]>(STORAGE_KEYS.PARTNER_DEALS, INITIAL_PARTNER_DEALS);
  },

  savePartnerDeals: (deals: PartnerDeal[]): void => {
    setToStorage(STORAGE_KEYS.PARTNER_DEALS, deals);
  },

  addPartnerDeal: (deal: Omit<PartnerDeal, 'id'>): PartnerDeal => {
    const list = StorageService.getPartnerDeals();
    const newDeal: PartnerDeal = {
      ...deal,
      id: `deal_${Date.now()}`
    };
    setToStorage(STORAGE_KEYS.PARTNER_DEALS, [newDeal, ...list]);
    return newDeal;
  },

  updatePartnerDeal: (updatedDeal: PartnerDeal): void => {
    const list = StorageService.getPartnerDeals();
    const updated = list.map(d => d.id === updatedDeal.id ? updatedDeal : d);
    setToStorage(STORAGE_KEYS.PARTNER_DEALS, updated);
  },

  deletePartnerDeal: (id: string): void => {
    const list = StorageService.getPartnerDeals();
    const updated = list.filter(d => d.id !== id);
    setToStorage(STORAGE_KEYS.PARTNER_DEALS, updated);
  },

  // Payments
  getPayments: (userId?: string): PaymentTransaction[] => {
    const list = getFromStorage<PaymentTransaction[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    if (userId) return list.filter(p => p.userId === userId);
    return list;
  },

  addPayment: (payment: Omit<PaymentTransaction, 'id' | 'createdDate'>): PaymentTransaction => {
    const list = StorageService.getPayments();
    const newPayment: PaymentTransaction = {
      ...payment,
      id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdDate: new Date().toISOString()
    };
    setToStorage(STORAGE_KEYS.PAYMENTS, [newPayment, ...list]);
    return newPayment;
  },

  updatePaymentStatus: (id: string, status: PaymentTransaction['status']): void => {
    const list = StorageService.getPayments();
    const updated = list.map(p => p.id === id ? {
      ...p,
      status,
      completedDate: status === 'Successful' ? new Date().toISOString() : p.completedDate
    } : p);
    setToStorage(STORAGE_KEYS.PAYMENTS, updated);
  },

  // Subscription Pricing Config
  getSubscriptionConfig: (): SubscriptionConfig => {
    return getFromStorage<SubscriptionConfig>(STORAGE_KEYS.SUBSCRIPTION_CONFIG, INITIAL_SUBSCRIPTION_CONFIG);
  },

  saveSubscriptionConfig: (config: SubscriptionConfig): void => {
    setToStorage(STORAGE_KEYS.SUBSCRIPTION_CONFIG, config);
  },

  // Audit Logs
  getAuditLogs: (): AuditLog[] => {
    return getFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  addAuditLog: (action: string, details: string, actorEmail: string = 'system@campuscoin.hit.ac.zw'): void => {
    const list = StorageService.getAuditLogs();
    const log: AuditLog = {
      id: `log_${Date.now()}`,
      actorEmail,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setToStorage(STORAGE_KEYS.AUDIT_LOGS, [log, ...list.slice(0, 99)]); // keep last 100
  },

  // Export Data
  exportAllDataJson: (userId: string): string => {
    const data = {
      user: StorageService.getCurrentUser(),
      transactions: StorageService.getTransactions(userId),
      budget: StorageService.getBudget(userId),
      goals: StorageService.getGoals(userId),
      recurring: StorageService.getRecurring(userId),
      semesterPlan: StorageService.getSemesterPlan(userId),
      payments: StorageService.getPayments(userId),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  },

  exportTransactionsCsv: (userId: string): string => {
    const txs = StorageService.getTransactions(userId);
    const headers = ['Date', 'Type', 'Amount', 'Category', 'Merchant', 'Payment Method', 'Notes'];
    const rows = txs.map(t => [
      t.date,
      t.type,
      t.amount.toFixed(2),
      `"${t.category.replace(/"/g, '""')}"`,
      `"${t.merchant.replace(/"/g, '""')}"`,
      t.paymentMethod,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
};
