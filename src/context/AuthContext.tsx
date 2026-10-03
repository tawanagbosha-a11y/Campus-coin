import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
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
  SafeToSpendBreakdown,
  FinancialInsight
} from '../types';
import { StorageService } from '../db/storage';
import { calculateSafeToSpend } from '../services/safeToSpend';
import { generateFinancialInsights } from '../services/insightsEngine';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase/config';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  activeView: string;
  setActiveView: (view: string) => void;
  login: (email: string, password?: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  loginAsDemoStudent: () => void;
  register: (profileData: Partial<UserProfile>, password?: string) => Promise<boolean>;
  logout: () => void;
  verifyHitStudent: () => void;
  togglePlan: () => void;
  resetToDemo: () => void;
  
  // Data
  transactions: Transaction[];
  categories: Category[];
  budget: Budget;
  goals: SavingsGoal[];
  recurring: RecurringExpense[];
  semesterPlan: SemesterPlan;
  notifications: AppNotification[];
  partnerDeals: PartnerDeal[];
  payments: PaymentTransaction[];
  subscriptionConfig: SubscriptionConfig;
  safeToSpend: SafeToSpendBreakdown;
  insights: FinancialInsight[];
  
  // Actions
  refreshData: () => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => Transaction;
  updateTransaction: (tx: Transaction) => void;
  deleteTransaction: (id: string) => void;
  saveBudget: (budget: Budget) => void;
  addGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'contributions'>) => SavingsGoal;
  contributeToGoal: (goalId: string, amount: number, note?: string) => void;
  deleteGoal: (id: string) => void;
  saveSemesterPlan: (plan: SemesterPlan) => void;
  addRecurring: (rec: Omit<RecurringExpense, 'id'>) => RecurringExpense;
  deleteRecurring: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addPartnerDeal: (deal: Omit<PartnerDeal, 'id'>) => PartnerDeal;
  updatePartnerDeal: (deal: PartnerDeal) => void;
  deletePartnerDeal: (id: string) => void;
  saveSubscriptionConfig: (config: SubscriptionConfig) => void;
  updateUserProfile: (user: UserProfile) => void;
  exportDataJson: () => void;
  exportTransactionsCsv: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<string>('home');

  // Data states
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budget, setBudget] = useState<Budget>({} as Budget);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [recurring, setRecurring] = useState<RecurringExpense[]>([]);
  const [semesterPlan, setSemesterPlan] = useState<SemesterPlan>({} as SemesterPlan);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [partnerDeals, setPartnerDeals] = useState<PartnerDeal[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [subscriptionConfig, setSubscriptionConfig] = useState<SubscriptionConfig>({
    monthlyPrice: 1.50,
    semesterPrice: 6.00,
    currency: 'USD'
  });

  const loadData = useCallback(() => {
    StorageService.init();
    const currentUser = StorageService.getCurrentUser();
    setUser(currentUser);
    setIsAuthenticated(!!currentUser);

    const txs = StorageService.getTransactions(currentUser?.id);
    const cats = StorageService.getCategories();
    const bgt = StorageService.getBudget(currentUser?.id);
    const gls = StorageService.getGoals(currentUser?.id);
    const recs = StorageService.getRecurring(currentUser?.id);
    const splan = StorageService.getSemesterPlan(currentUser?.id);
    const notifs = StorageService.getNotifications(currentUser?.id);
    const deals = StorageService.getPartnerDeals();
    const pymts = StorageService.getPayments(currentUser?.id);
    const subCfg = StorageService.getSubscriptionConfig();

    setTransactions(txs);
    setCategories(cats);
    setBudget(bgt);
    setGoals(gls);
    setRecurring(recs);
    setSemesterPlan(splan);
    setNotifications(notifs);
    setPartnerDeals(deals);
    setPayments(pymts);
    setSubscriptionConfig(subCfg);
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // Fetch or create user in Firestore
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          let studentProfile: UserProfile;

          if (snap.exists()) {
            studentProfile = snap.data() as UserProfile;
          } else {
            const names = (fbUser.displayName || 'HIT Student').split(' ');
            studentProfile = {
              id: fbUser.uid,
              firstName: names[0] || 'HIT',
              lastName: names.slice(1).join(' ') || 'Student',
              email: fbUser.email || 'student@hit.ac.zw',
              studentRegNumber: `H2${Math.floor(10000 + Math.random() * 90000)}T`,
              programme: 'BTech Information Technology',
              yearOfStudy: 2,
              campus: 'Harare Institute of Technology (HIT)',
              isHitVerified: (fbUser.email || '').endsWith('@hit.ac.zw'),
              isPremium: false,
              subscriptionTier: 'free',
              role: (fbUser.email || '').includes('admin') ? 'admin' : 'student',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            await setDoc(userDocRef, studentProfile);
          }

          StorageService.setCurrentUser(studentProfile);
          setUser(studentProfile);
          setIsAuthenticated(true);
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${fbUser.uid}`);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derived Safe-to-Spend
  const safeToSpend = useMemo(() => {
    return calculateSafeToSpend(transactions, semesterPlan, recurring, goals);
  }, [transactions, semesterPlan, recurring, goals]);

  // Derived rule-based insights
  const insights = useMemo(() => {
    return generateFinancialInsights(transactions, budget, goals, safeToSpend, recurring);
  }, [transactions, budget, goals, safeToSpend, recurring]);

  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        setActiveView('dashboard');
        return true;
      }
      return false;
    } catch (err: any) {
      // Gracefully handle expected user cancellations or popup dismissals
      const errorCode = err?.code || '';
      const errorMessage = err?.message || '';

      if (
        errorCode === 'auth/popup-closed-by-user' ||
        errorCode === 'auth/cancelled-popup-request' ||
        errorMessage.includes('popup-closed-by-user') ||
        errorMessage.includes('cancelled-popup-request')
      ) {
        console.info('Google sign-in window was closed by the user.');
        return false;
      }

      if (errorCode === 'auth/popup-blocked' || errorMessage.includes('popup-blocked')) {
        console.warn('Sign-in popup was blocked by browser. Please enable popups or use email login.');
        return false;
      }

      console.warn('Google Sign-In notice:', errorMessage);
      return false;
    }
  };

  const login = async (email: string): Promise<boolean> => {
    const allUsers = StorageService.getAllUsers();
    const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      setIsAuthenticated(true);
      StorageService.setCurrentUser(found);
      setActiveView('dashboard');
      loadData();
      return true;
    }
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      firstName: email.split('@')[0],
      lastName: 'Student',
      email,
      studentRegNumber: `H2${Math.floor(10000 + Math.random() * 90000)}T`,
      programme: 'BTech Information Technology',
      yearOfStudy: 1,
      campus: 'Harare Institute of Technology (HIT)',
      isHitVerified: email.endsWith('@hit.ac.zw'),
      isPremium: false,
      subscriptionTier: 'free',
      role: email.includes('admin') ? 'admin' : 'student',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    StorageService.setCurrentUser(newUser);
    setUser(newUser);
    setIsAuthenticated(true);
    setActiveView('dashboard');
    loadData();
    return true;
  };

  const loginAsDemoStudent = () => {
    StorageService.resetDemoData();
    const demoUser = StorageService.getCurrentUser();
    setUser(demoUser);
    setIsAuthenticated(true);
    setActiveView('dashboard');
    loadData();
  };

  const register = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    const isHit = (profileData.email || '').toLowerCase().endsWith('@hit.ac.zw');
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      firstName: profileData.firstName || 'HIT',
      lastName: profileData.lastName || 'Student',
      email: profileData.email || 'student@hit.ac.zw',
      studentRegNumber: profileData.studentRegNumber || 'H240101A',
      programme: profileData.programme || 'BTech Information Technology',
      yearOfStudy: profileData.yearOfStudy || 1,
      gender: profileData.gender,
      phoneNumber: profileData.phoneNumber,
      campus: profileData.campus || 'Harare Institute of Technology (HIT)',
      isHitVerified: isHit,
      isPremium: false,
      subscriptionTier: 'free',
      role: 'student',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    StorageService.setCurrentUser(newUser);
    setUser(newUser);
    setIsAuthenticated(true);
    setActiveView('dashboard');
    loadData();
    return true;
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // Ignore if not signed in via Firebase
    }
    setIsAuthenticated(false);
    setUser(null);
    setActiveView('home');
  };

  const verifyHitStudent = () => {
    if (!user) return;
    const updated = { ...user, isHitVerified: true };
    StorageService.setCurrentUser(updated);
    setUser(updated);

    if (firebaseUser) {
      setDoc(doc(db, 'users', firebaseUser.uid), updated, { merge: true }).catch(() => {});
    }

    StorageService.addAuditLog('VERIFY_STUDENT', `Manually confirmed student credential verification for ${user.email}`);
    StorageService.addNotification({
      userId: user.id,
      type: 'system',
      title: 'HIT Student Status Verified!',
      message: 'Your official Harare Institute of Technology student badge is now active.',
      read: false
    });
    loadData();
  };

  const togglePlan = () => {
    if (!user) return;
    const isNowPremium = !user.isPremium;
    const updated: UserProfile = {
      ...user,
      isPremium: isNowPremium,
      subscriptionTier: isNowPremium ? 'plus' : 'free'
    };
    StorageService.setCurrentUser(updated);
    setUser(updated);
    if (firebaseUser) {
      setDoc(doc(db, 'users', firebaseUser.uid), updated, { merge: true }).catch(() => {});
    }
    loadData();
  };

  const resetToDemo = () => {
    StorageService.resetDemoData();
    loadData();
  };

  // Actions
  const addTransaction = (tx: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
    const created = StorageService.addTransaction(tx);
    if (firebaseUser) {
      setDoc(doc(db, `users/${firebaseUser.uid}/transactions`, created.id), created).catch(() => {});
    }
    loadData();
    return created;
  };

  const updateTransaction = (tx: Transaction) => {
    StorageService.updateTransaction(tx);
    if (firebaseUser) {
      setDoc(doc(db, `users/${firebaseUser.uid}/transactions`, tx.id), tx, { merge: true }).catch(() => {});
    }
    loadData();
  };

  const deleteTransaction = (id: string) => {
    StorageService.deleteTransaction(id);
    loadData();
  };

  const saveBudget = (b: Budget) => {
    StorageService.saveBudget(b);
    if (firebaseUser) {
      setDoc(doc(db, `users/${firebaseUser.uid}/budgets`, b.id || 'default'), b, { merge: true }).catch(() => {});
    }
    loadData();
  };

  const addGoal = (g: Omit<SavingsGoal, 'id' | 'createdAt' | 'contributions'>): SavingsGoal => {
    const created = StorageService.addGoal(g);
    if (firebaseUser) {
      setDoc(doc(db, `users/${firebaseUser.uid}/goals`, created.id), created).catch(() => {});
    }
    loadData();
    return created;
  };

  const contributeToGoal = (goalId: string, amount: number, note?: string) => {
    const updated = StorageService.contributeToGoal(goalId, amount, note);
    if (firebaseUser && updated) {
      setDoc(doc(db, `users/${firebaseUser.uid}/goals`, goalId), updated, { merge: true }).catch(() => {});
    }
    loadData();
  };

  const deleteGoal = (id: string) => {
    StorageService.deleteGoal(id);
    loadData();
  };

  const saveSemesterPlan = (plan: SemesterPlan) => {
    StorageService.saveSemesterPlan(plan);
    if (firebaseUser) {
      setDoc(doc(db, `users/${firebaseUser.uid}/semester_plans`, plan.id || 'current'), plan, { merge: true }).catch(() => {});
    }
    loadData();
  };

  const addRecurring = (rec: Omit<RecurringExpense, 'id'>): RecurringExpense => {
    const created = StorageService.addRecurring(rec);
    loadData();
    return created;
  };

  const deleteRecurring = (id: string) => {
    StorageService.deleteRecurring(id);
    loadData();
  };

  const markNotificationRead = (id: string) => {
    StorageService.markNotificationAsRead(id);
    loadData();
  };

  const markAllNotificationsRead = () => {
    StorageService.markAllNotificationsAsRead();
    loadData();
  };

  const addPartnerDeal = (deal: Omit<PartnerDeal, 'id'>): PartnerDeal => {
    const created = StorageService.addPartnerDeal(deal);
    loadData();
    return created;
  };

  const updatePartnerDeal = (deal: PartnerDeal) => {
    StorageService.updatePartnerDeal(deal);
    loadData();
  };

  const deletePartnerDeal = (id: string) => {
    StorageService.deletePartnerDeal(id);
    loadData();
  };

  const saveSubscriptionConfig = (config: SubscriptionConfig) => {
    StorageService.saveSubscriptionConfig(config);
    loadData();
  };

  const updateUserProfile = (u: UserProfile) => {
    StorageService.setCurrentUser(u);
    setUser(u);
    if (firebaseUser) {
      setDoc(doc(db, 'users', firebaseUser.uid), u, { merge: true }).catch(() => {});
    }
    loadData();
  };

  const exportDataJson = () => {
    if (!user) return;
    const jsonStr = StorageService.exportAllDataJson(user.id);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CampusCoin_Export_${user.studentRegNumber || 'data'}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportTransactionsCsv = () => {
    if (!user) return;
    const csvStr = StorageService.exportTransactionsCsv(user.id);
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CampusCoin_Transactions_${user.studentRegNumber || 'txs'}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated,
        activeView,
        setActiveView,
        login,
        signInWithGoogle,
        loginAsDemoStudent,
        register,
        logout,
        verifyHitStudent,
        togglePlan,
        resetToDemo,
        transactions,
        categories,
        budget,
        goals,
        recurring,
        semesterPlan,
        notifications,
        partnerDeals,
        payments,
        subscriptionConfig,
        safeToSpend,
        insights,
        refreshData: loadData,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        saveBudget,
        addGoal,
        contributeToGoal,
        deleteGoal,
        saveSemesterPlan,
        addRecurring,
        deleteRecurring,
        markNotificationRead,
        markAllNotificationsRead,
        addPartnerDeal,
        updatePartnerDeal,
        deletePartnerDeal,
        saveSubscriptionConfig,
        updateUserProfile,
        exportDataJson,
        exportTransactionsCsv
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
