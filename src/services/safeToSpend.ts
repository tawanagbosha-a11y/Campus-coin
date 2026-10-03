import { SafeToSpendBreakdown, Transaction, SemesterPlan, RecurringExpense, SavingsGoal } from '../types';

export function calculateSafeToSpend(
  transactions: Transaction[],
  semesterPlan?: SemesterPlan | null,
  recurringExpenses: RecurringExpense[] = [],
  goals: SavingsGoal[] = []
): SafeToSpendBreakdown {
  // 1. Calculate current real-time liquid balance
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const availableBalance = Math.max(0, totalIncome - totalExpense);

  // 2. Calculate remaining days in semester or month
  let remainingDays = 30; // fallback default
  const today = new Date();

  if (semesterPlan && semesterPlan.endDate) {
    const end = new Date(semesterPlan.endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    remainingDays = diffDays > 0 ? diffDays : 1;
  }

  // 3. Calculate upcoming commitments for this month / remaining semester
  // Active recurring bills due within the next 30 days
  const upcomingRecurring = recurringExpenses
    .filter(r => r.isActive)
    .reduce((sum, r) => sum + r.amount, 0);

  // Upcoming semester fees/commitments if not already fully paid
  const upcomingFees = semesterPlan ? Math.min(semesterPlan.fees * 0.25, 40) : 0; // prorated portion for current month cushion
  const upcomingCommitments = Math.round((upcomingRecurring + upcomingFees) * 100) / 100;

  // 4. Calculate planned savings reserve (to protect student goals)
  // Student shouldn't accidentally spend money meant for their savings target
  const activeGoals = goals.filter(g => g.status === 'active');
  const plannedSavings = Math.min(
    availableBalance * 0.2, // cap at 20% of current balance so student isn't left with $0
    activeGoals.reduce((sum, g) => {
      const remainingToSave = Math.max(0, g.targetAmount - g.currentAmount);
      // Allocate a small weekly share (e.g. 5% of remaining)
      return sum + Math.min(remainingToSave * 0.05, 15);
    }, 0)
  );

  // 5. Net spendable
  const netSpendable = Math.max(0, availableBalance - upcomingCommitments - plannedSavings);

  // 6. Safe to spend per day and week
  // For daily living, remaining days in current allowance cycle (usually 14 to 30 days, or semester)
  const cycleDays = Math.min(remainingDays, 30);
  const safeToSpendDaily = Math.round((netSpendable / Math.max(1, cycleDays)) * 100) / 100;
  const safeToSpendWeekly = Math.round((safeToSpendDaily * 7) * 100) / 100;

  // Status indicator
  let status: 'comfortable' | 'moderate' | 'tight' = 'moderate';
  if (safeToSpendDaily >= 6.00) {
    status = 'comfortable';
  } else if (safeToSpendDaily >= 3.00) {
    status = 'moderate';
  } else {
    status = 'tight';
  }

  return {
    availableBalance: Math.round(availableBalance * 100) / 100,
    upcomingCommitments,
    plannedSavings: Math.round(plannedSavings * 100) / 100,
    netSpendable: Math.round(netSpendable * 100) / 100,
    remainingDays,
    safeToSpendDaily,
    safeToSpendWeekly,
    status
  };
}
