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
  AuditLog
} from '../types';

export const INITIAL_DEMO_USER: UserProfile = {
  id: 'usr_tendai_hit_01',
  firstName: 'Tendai',
  lastName: 'Moyo',
  email: 'tendai.moyo@hit.ac.zw',
  studentRegNumber: 'H230489T',
  programme: 'BTech Information Technology',
  yearOfStudy: 2,
  gender: 'Female',
  phoneNumber: '+263 77 123 4567',
  campus: 'Harare Institute of Technology (HIT)',
  isHitVerified: true,
  isPremium: true,
  subscriptionTier: 'plus',
  role: 'student',
  createdAt: '2026-08-15T09:00:00Z',
  updatedAt: '2026-10-01T14:20:00Z'
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_food', name: 'Food & Meals', icon: 'Utensils', color: '#f59e0b', type: 'expense', isDefault: true },
  { id: 'cat_transport', name: 'Transport & Kombis', icon: 'Bus', color: '#3b82f6', type: 'expense', isDefault: true },
  { id: 'cat_academic', name: 'Academic & Printing', icon: 'BookOpen', color: '#10b981', type: 'expense', isDefault: true },
  { id: 'cat_airtime', name: 'Airtime & Data', icon: 'Wifi', color: '#8b5cf6', type: 'expense', isDefault: true },
  { id: 'cat_accommodation', name: 'Accommodation & Rent', icon: 'Home', color: '#ef4444', type: 'expense', isDefault: true },
  { id: 'cat_entertainment', name: 'Entertainment & Outings', icon: 'Film', color: '#ec4899', type: 'expense', isDefault: true },
  { id: 'cat_shopping', name: 'Personal & Shopping', icon: 'ShoppingBag', color: '#06b6d4', type: 'expense', isDefault: true },
  { id: 'cat_other_exp', name: 'Other Expenses', icon: 'MoreHorizontal', color: '#64748b', type: 'expense', isDefault: true },
  { id: 'cat_allowance', name: 'Allowance & Family', icon: 'Gift', color: '#10b981', type: 'income', isDefault: true },
  { id: 'cat_stipend', name: 'Part-time & Tutoring', icon: 'Briefcase', color: '#3b82f6', type: 'income', isDefault: true },
  { id: 'cat_bursary', name: 'Bursary & Grants', icon: 'GraduationCap', color: '#f59e0b', type: 'income', isDefault: true },
  { id: 'cat_other_inc', name: 'Other Income', icon: 'ArrowDownLeft', color: '#8b5cf6', type: 'income', isDefault: true }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_01',
    userId: 'usr_tendai_hit_01',
    type: 'income',
    amount: 180.00,
    category: 'Allowance & Family',
    merchant: 'Monthly Family Remittance',
    date: '2026-10-01',
    paymentMethod: 'EcoCash',
    notes: 'October living allowance from parents in Bulawayo',
    isRecurring: true,
    createdAt: '2026-10-01T08:30:00Z'
  },
  {
    id: 'tx_02',
    userId: 'usr_tendai_hit_01',
    type: 'income',
    amount: 45.00,
    category: 'Part-time & Tutoring',
    merchant: 'First-Year Python Tutoring',
    date: '2026-10-02',
    paymentMethod: 'Cash',
    notes: '3 weekend sessions tutoring Intro to Programming',
    isRecurring: false,
    createdAt: '2026-10-02T16:00:00Z'
  },
  {
    id: 'tx_03',
    userId: 'usr_tendai_hit_01',
    type: 'expense',
    amount: 4.50,
    category: 'Food & Meals',
    merchant: 'HIT Main Cafeteria',
    date: '2026-10-02',
    paymentMethod: 'EcoCash',
    notes: 'Sadza with beef stew & leafy greens',
    isRecurring: false,
    createdAt: '2026-10-02T12:45:00Z'
  },
  {
    id: 'tx_04',
    userId: 'usr_tendai_hit_01',
    type: 'expense',
    amount: 12.00,
    category: 'Airtime & Data',
    merchant: 'Econet Private WiFi Bundle',
    date: '2026-10-01',
    paymentMethod: 'EcoCash',
    notes: 'Monthly 15GB student e-learning and research data',
    isRecurring: true,
    createdAt: '2026-10-01T10:15:00Z'
  },
  {
    id: 'tx_05',
    userId: 'usr_tendai_hit_01',
    type: 'expense',
    amount: 1.50,
    category: 'Transport & Kombis',
    merchant: 'Kombi Belvedere - HIT Gate',
    date: '2026-10-02',
    paymentMethod: 'Cash',
    notes: 'Morning commute to campus',
    isRecurring: false,
    createdAt: '2026-10-02T07:45:00Z'
  },
  {
    id: 'tx_06',
    userId: 'usr_tendai_hit_01',
    type: 'expense',
    amount: 8.50,
    category: 'Academic & Printing',
    merchant: 'PrintPro Belvedere',
    date: '2026-09-29',
    paymentMethod: 'EcoCash',
    notes: 'Algorithms Lab Manual bound copies',
    isRecurring: false,
    createdAt: '2026-09-29T14:10:00Z'
  },
  {
    id: 'tx_07',
    userId: 'usr_tendai_hit_01',
    type: 'expense',
    amount: 15.00,
    category: 'Food & Meals',
    merchant: 'OK Mart Belvedere Groceries',
    date: '2026-09-28',
    paymentMethod: 'Card',
    notes: 'Oats, milk, tea bags, cooking oil & fruit',
    isRecurring: false,
    createdAt: '2026-09-28T17:30:00Z'
  },
  {
    id: 'tx_08',
    userId: 'usr_tendai_hit_01',
    type: 'expense',
    amount: 3.00,
    category: 'Transport & Kombis',
    merchant: 'Return Kombis Town - Campus',
    date: '2026-09-27',
    paymentMethod: 'Cash',
    notes: 'Trip to CBD for electronics component shop',
    isRecurring: false,
    createdAt: '2026-09-27T18:00:00Z'
  },
  {
    id: 'tx_09',
    userId: 'usr_tendai_hit_01',
    type: 'expense',
    amount: 6.00,
    category: 'Entertainment & Outings',
    merchant: 'Campus Snack Bar & Smoothies',
    date: '2026-09-26',
    paymentMethod: 'EcoCash',
    notes: 'Friday study group refreshments',
    isRecurring: false,
    createdAt: '2026-09-26T16:20:00Z'
  },
  {
    id: 'tx_10',
    userId: 'usr_tendai_hit_01',
    type: 'expense',
    amount: 25.00,
    category: 'Accommodation & Rent',
    merchant: 'Hostel Room Contribution',
    date: '2026-09-25',
    paymentMethod: 'Bank',
    notes: 'Shared hostel maintenance and gas refill fee',
    isRecurring: true,
    createdAt: '2026-09-25T11:00:00Z'
  }
];

export const INITIAL_BUDGET: Budget = {
  id: 'bgt_oct_2026',
  userId: 'usr_tendai_hit_01',
  month: '2026-10',
  totalBudget: 195.00,
  categories: [
    { categoryId: 'cat_food', categoryName: 'Food & Meals', allocated: 75.00, spent: 19.50 },
    { categoryId: 'cat_transport', categoryName: 'Transport & Kombis', allocated: 35.00, spent: 4.50 },
    { categoryId: 'cat_airtime', categoryName: 'Airtime & Data', allocated: 18.00, spent: 12.00 },
    { categoryId: 'cat_academic', categoryName: 'Academic & Printing', allocated: 25.00, spent: 8.50 },
    { categoryId: 'cat_entertainment', categoryName: 'Entertainment & Outings', allocated: 20.00, spent: 6.00 },
    { categoryId: 'cat_shopping', categoryName: 'Personal & Shopping', allocated: 22.00, spent: 0.00 }
  ]
};

export const INITIAL_GOALS: SavingsGoal[] = [
  {
    id: 'goal_laptop',
    userId: 'usr_tendai_hit_01',
    name: 'Refurbished ThinkPad / Project Laptop',
    targetAmount: 420.00,
    currentAmount: 195.00,
    targetDate: '2026-12-15',
    category: 'Tech & Academic Equipment',
    contributionFrequency: 'weekly',
    icon: 'Laptop',
    status: 'active',
    createdAt: '2026-08-20T10:00:00Z',
    contributions: [
      { id: 'gc_01', goalId: 'goal_laptop', amount: 80.00, date: '2026-08-25', note: 'Start contribution' },
      { id: 'gc_02', goalId: 'goal_laptop', amount: 65.00, date: '2026-09-10', note: 'September tutoring savings' },
      { id: 'gc_03', goalId: 'goal_laptop', amount: 50.00, date: '2026-09-28', note: 'Saved from transport' }
    ]
  },
  {
    id: 'goal_cushion',
    userId: 'usr_tendai_hit_01',
    name: 'End-of-Semester Emergency Cushion',
    targetAmount: 100.00,
    currentAmount: 75.00,
    targetDate: '2026-11-30',
    category: 'Emergency Fund',
    contributionFrequency: 'monthly',
    icon: 'ShieldCheck',
    status: 'active',
    createdAt: '2026-08-25T14:00:00Z',
    contributions: [
      { id: 'gc_04', goalId: 'goal_cushion', amount: 40.00, date: '2026-09-01', note: 'Initial cushion deposit' },
      { id: 'gc_05', goalId: 'goal_cushion', amount: 35.00, date: '2026-09-25', note: 'September rollover' }
    ]
  }
];

export const INITIAL_RECURRING: RecurringExpense[] = [
  {
    id: 'rec_01',
    userId: 'usr_tendai_hit_01',
    title: 'Econet Student Internet Bundle',
    amount: 12.00,
    frequency: 'monthly',
    nextDueDate: '2026-11-01',
    category: 'Airtime & Data',
    paymentMethod: 'EcoCash',
    isActive: true
  },
  {
    id: 'rec_02',
    userId: 'usr_tendai_hit_01',
    title: 'Weekly Commuter Kombi Fare',
    amount: 8.50,
    frequency: 'weekly',
    nextDueDate: '2026-10-09',
    category: 'Transport & Kombis',
    paymentMethod: 'Cash',
    isActive: true
  },
  {
    id: 'rec_03',
    userId: 'usr_tendai_hit_01',
    title: 'Semester Final Exam Registration Balance',
    amount: 35.00,
    frequency: 'per_semester',
    nextDueDate: '2026-11-15',
    category: 'Academic & Printing',
    paymentMethod: 'Bank',
    isActive: true
  }
];

export const INITIAL_SEMESTER_PLAN: SemesterPlan = {
  id: 'sem_plan_hit_2026_s1',
  userId: 'usr_tendai_hit_01',
  semesterName: 'HIT Semester 1 (2026/2027)',
  startDate: '2026-08-18',
  endDate: '2026-12-12',
  expectedIncome: 920.00, // Total expected across the 16-week semester
  allowanceSchedule: [
    { date: '2026-08-20', amount: 180.00, source: 'Parent Allowance' },
    { date: '2026-09-01', amount: 180.00, source: 'Parent Allowance' },
    { date: '2026-10-01', amount: 180.00, source: 'Parent Allowance' },
    { date: '2026-11-01', amount: 180.00, source: 'Parent Allowance' },
    { date: '2026-12-01', amount: 100.00, source: 'Parent Allowance' },
    { date: '2026-10-15', amount: 50.00, source: 'Coding Tutoring' },
    { date: '2026-11-15', amount: 50.00, source: 'Coding Tutoring' }
  ],
  fees: 150.00, // Remaining semester institutional fee commitment
  accommodation: 120.00,
  transportBudget: 110.00,
  foodBudget: 240.00,
  academicCosts: 65.00,
  airtimeData: 48.00,
  otherCosts: 40.00,
  savingsTarget: 147.00,
  notes: 'Priority: Ensure final exam registration balance is paid by Nov 15 without borrowing.'
};

export const INITIAL_PARTNER_DEALS: PartnerDeal[] = [
  {
    id: 'deal_01',
    businessName: 'HIT Campus Central Cafeteria',
    category: 'Food',
    title: 'Student Fuel Meal Combo (Sadza + Protein + Greens)',
    description: 'Show your HIT student ID card and get 15% discount on all daily hot lunches and mineral water bottles.',
    discount: '15% OFF',
    offerCode: 'HIT-MEAL15',
    location: 'HIT Student Union Building, Ground Floor',
    contact: '+263 77 981 2234',
    expiryDate: '2026-12-20',
    featured: true,
    sponsored: false,
    active: true,
    redeemedCount: 142
  },
  {
    id: 'deal_02',
    businessName: 'PrintPro Belvedere Digital & Binding',
    category: 'Printing & Tech',
    title: 'Final Year Report & Thesis Hardcover Binding Package',
    description: 'Premium colour laser printing, spiral binding, or executive gold embossed hardcovers. Free draft proof before final print run.',
    discount: '25% OFF',
    offerCode: 'CAMPUS-PRINT25',
    location: 'Belvedere Shops, Opposite HIT North Gate',
    contact: '+263 71 456 7890',
    expiryDate: '2026-12-31',
    featured: true,
    sponsored: true,
    active: true,
    redeemedCount: 89
  },
  {
    id: 'deal_03',
    businessName: 'ZimRide Campus Express Shuttle',
    category: 'Transport',
    title: 'Morning & Evening Dedicated Route to Harare CBD',
    description: 'Pre-book your seat on the student express shuttle departing HIT main gate every 20 minutes during rush hours. Discount on 10-ride punch passes.',
    discount: '$0.50 OFF / TRIP',
    offerCode: 'HIT-RIDE50',
    location: 'HIT Main Bus Terminus & Gate 2',
    contact: '+263 78 221 0099',
    expiryDate: '2026-11-30',
    featured: false,
    sponsored: false,
    active: true,
    redeemedCount: 215
  },
  {
    id: 'deal_04',
    businessName: 'TechByte Harare Laptop Repairs & Upgrades',
    category: 'Printing & Tech',
    title: 'Student Laptop Diagnostics, SSD Upgrades & Battery Replacement',
    description: 'Free hardware thermal paste check and 20% discount on original charger replacements and RAM upgrades for computer science and engineering students.',
    discount: '20% OFF',
    offerCode: 'TECH-CAMPUS20',
    location: 'Shop 14, Belvedere Commercial Mall, Harare',
    contact: '+263 77 345 6112',
    expiryDate: '2026-12-15',
    featured: true,
    sponsored: true,
    active: true,
    redeemedCount: 64
  },
  {
    id: 'deal_05',
    businessName: 'Econet Wireless Student Ambassador Booth',
    category: 'Printing & Tech',
    title: 'Smart Campus 20GB Study & Research Data Bundle',
    description: 'Exclusive discounted mobile data bundle valid on all academic research sites, Google Workspace, GitHub and institutional portals.',
    discount: 'SPECIAL $10/20GB',
    offerCode: 'ECONET-HITSTUDY',
    location: 'HIT Campus Student Gazebo / Booth 3',
    contact: 'dial *143#',
    expiryDate: '2026-12-31',
    featured: false,
    sponsored: true,
    active: true,
    redeemedCount: 310
  },
  {
    id: 'deal_06',
    businessName: 'GreenGrocer & Student Pantry Belvedere',
    category: 'Food',
    title: 'Weekly Fresh Student Grocery Hamper',
    description: 'Pre-packed budget student fresh box: Potatoes, tomatoes, onions, cabbage, eggs and cooking seasoning at wholesale prices.',
    discount: '12% OFF',
    offerCode: 'PANTRY-HIT12',
    location: '12 Gantree Road, Belvedere, Harare',
    contact: '+263 77 555 4321',
    expiryDate: '2026-11-20',
    featured: false,
    sponsored: false,
    active: true,
    redeemedCount: 78
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_01',
    userId: 'usr_tendai_hit_01',
    type: 'safe_to_spend',
    title: 'Daily Safe-to-Spend is $4.85',
    message: 'You have 64 days remaining in the semester. Keep your daily living spend under $4.85 to preserve your upcoming fees.',
    read: false,
    createdAt: '2026-10-03T07:00:00Z'
  },
  {
    id: 'notif_02',
    userId: 'usr_tendai_hit_01',
    type: 'goal_milestone',
    title: '46% towards your ThinkPad Laptop Goal!',
    message: 'You have accumulated $195.00. Keep up the weekly $15 contributions to hit your target before exam week.',
    read: false,
    createdAt: '2026-10-02T18:00:00Z'
  },
  {
    id: 'notif_03',
    userId: 'usr_tendai_hit_01',
    type: 'recurring_due',
    title: 'Upcoming: Weekly Kombi Pass ($8.50)',
    message: 'Your estimated weekly transport renewal is due in 6 days.',
    read: true,
    createdAt: '2026-10-01T09:00:00Z'
  }
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'pay_hit_9921',
    userId: 'usr_tendai_hit_01',
    planId: 'semester',
    amount: 6.00,
    currency: 'USD',
    status: 'Successful',
    provider: 'EcoCash',
    reference: 'EC-HIT-20260818-8841',
    createdDate: '2026-08-18T10:14:00Z',
    completedDate: '2026-08-18T10:14:32Z'
  }
];

export const INITIAL_SUBSCRIPTION_CONFIG: SubscriptionConfig = {
  monthlyPrice: 1.50,
  semesterPrice: 6.00,
  currency: 'USD'
};

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_01',
    actorEmail: 'admin@campuscoin.hit.ac.zw',
    action: 'VERIFY_STUDENT',
    details: 'Tendai Moyo (H230489T) verified as active HIT BTech IT student',
    timestamp: '2026-08-16T11:00:00Z'
  },
  {
    id: 'log_02',
    actorEmail: 'admin@campuscoin.hit.ac.zw',
    action: 'UPDATE_PRICING',
    details: 'Pilot pricing initialized at $1.50/mo and $6.00/semester pass',
    timestamp: '2026-08-15T08:00:00Z'
  },
  {
    id: 'log_03',
    actorEmail: 'admin@campuscoin.hit.ac.zw',
    action: 'APPROVE_PARTNER_DEAL',
    details: 'Approved PrintPro Belvedere sponsored partner offer',
    timestamp: '2026-08-22T14:30:00Z'
  }
];
