export type PaymentMethod = 'Cash' | 'EcoCash' | 'Bank' | 'Card' | 'Other';

export type TransactionType = 'expense' | 'income';

export type UserRole = 'student' | 'admin';

export type SubscriptionTier = 'free' | 'plus';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentRegNumber: string;
  programme: string;
  yearOfStudy: number;
  gender?: string;
  phoneNumber?: string;
  campus: string;
  isHitVerified: boolean;
  isPremium: boolean;
  subscriptionTier: SubscriptionTier;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  merchant: string;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  notes?: string;
  isRecurring: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  isDefault: boolean;
}

export interface BudgetCategoryItem {
  categoryId: string;
  categoryName: string;
  allocated: number;
  spent: number;
}

export interface Budget {
  id: string;
  userId: string;
  month: string; // YYYY-MM
  totalBudget: number;
  categories: BudgetCategoryItem[];
}

export interface GoalContribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  note?: string;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  contributionFrequency: 'weekly' | 'monthly' | 'irregular';
  icon?: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  contributions?: GoalContribution[];
}

export interface RecurringExpense {
  id: string;
  userId: string;
  title: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'per_semester';
  nextDueDate: string;
  category: string;
  paymentMethod: PaymentMethod;
  isActive: boolean;
}

export interface AllowanceScheduleItem {
  date: string;
  amount: number;
  source: string;
}

export interface SemesterPlan {
  id: string;
  userId: string;
  semesterName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  expectedIncome: number;
  allowanceSchedule: AllowanceScheduleItem[];
  fees: number;
  accommodation: number;
  transportBudget: number;
  foodBudget: number;
  academicCosts: number;
  airtimeData: number;
  otherCosts: number;
  savingsTarget: number;
  notes?: string;
}

export interface FinancialInsight {
  id: string;
  userId: string;
  type: 'positive' | 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  category?: string;
  metric?: string;
  actionText?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: 'budget_alert' | 'recurring_due' | 'goal_milestone' | 'safe_to_spend' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  budgetAlerts: boolean;
  safeToSpendDaily: boolean;
  upcomingBills: boolean;
  goalMilestones: boolean;
  campusDeals: boolean;
  emailDigest: boolean;
}

export interface SubscriptionConfig {
  monthlyPrice: number;
  semesterPrice: number;
  currency: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: 'monthly' | 'semester';
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  amount: number;
  currency: string;
  paymentReference: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  currency: string;
  status: 'Pending' | 'Successful' | 'Failed' | 'Cancelled' | 'Refunded';
  provider: 'EcoCash' | 'Paynow' | 'Card' | 'Bank';
  reference: string;
  createdDate: string;
  completedDate?: string;
}

export interface PartnerDeal {
  id: string;
  businessName: string;
  category: 'Food' | 'Printing & Tech' | 'Transport' | 'Books & Stationery' | 'Health & Grooming' | 'Other';
  title: string;
  description: string;
  discount: string;
  offerCode: string;
  location: string;
  contact: string;
  expiryDate: string;
  featured: boolean;
  sponsored: boolean;
  active: boolean;
  redeemedCount?: number;
}

export interface AuditLog {
  id: string;
  actorEmail: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface SafeToSpendBreakdown {
  availableBalance: number;
  upcomingCommitments: number;
  plannedSavings: number;
  netSpendable: number;
  remainingDays: number;
  safeToSpendDaily: number;
  safeToSpendWeekly: number;
  status: 'comfortable' | 'moderate' | 'tight';
}
