import { FinancialInsight, Transaction, Budget, SavingsGoal, SafeToSpendBreakdown, RecurringExpense } from '../types';

export function generateFinancialInsights(
  transactions: Transaction[],
  budget: Budget,
  goals: SavingsGoal[],
  safeToSpend: SafeToSpendBreakdown,
  recurring: RecurringExpense[] = []
): FinancialInsight[] {
  const insights: FinancialInsight[] = [];
  const now = new Date().toISOString();

  // 1. Budget category overruns (>80% and >100%)
  if (budget && budget.categories) {
    for (const cat of budget.categories) {
      if (cat.allocated > 0) {
        const ratio = cat.spent / cat.allocated;
        if (ratio >= 1.0) {
          insights.push({
            id: `ins_over_${cat.categoryId}`,
            userId: budget.userId,
            type: 'danger',
            title: `${cat.categoryName} Budget Exceeded`,
            message: `You have spent $${cat.spent.toFixed(2)} of your $${cat.allocated.toFixed(2)} budget (${Math.round(ratio * 100)}%). Consider shifting funds or limiting discretionary purchases in this category.`,
            category: cat.categoryName,
            metric: `${Math.round(ratio * 100)}% used`,
            actionText: 'Adjust Category Budget',
            createdAt: now
          });
        } else if (ratio >= 0.8) {
          insights.push({
            id: `ins_warn_${cat.categoryId}`,
            userId: budget.userId,
            type: 'warning',
            title: `${cat.categoryName} Budget Nearly Exhausted`,
            message: `You've used $${cat.spent.toFixed(2)} (${Math.round(ratio * 100)}%) of your $${cat.allocated.toFixed(2)} limit. Only $${(cat.allocated - cat.spent).toFixed(2)} remains for the rest of this month.`,
            category: cat.categoryName,
            metric: `$${(cat.allocated - cat.spent).toFixed(2)} left`,
            actionText: 'View Spending',
            createdAt: now
          });
        }
      }
    }
  }

  // 2. Safe-to-Spend Alert
  if (safeToSpend.status === 'tight') {
    insights.push({
      id: 'ins_tight_spend',
      userId: budget.userId,
      type: 'warning',
      title: 'High Spending Pace Detected',
      message: `Your safe spending ceiling is currently $${safeToSpend.safeToSpendDaily.toFixed(2)}/day. Pacing yourself now protects your upcoming fixed student commitments.`,
      metric: `$${safeToSpend.safeToSpendDaily.toFixed(2)}/day safe limit`,
      actionText: 'Review Commitments',
      createdAt: now
    });
  } else if (safeToSpend.status === 'comfortable') {
    insights.push({
      id: 'ins_good_runway',
      userId: budget.userId,
      type: 'positive',
      title: 'Healthy Semester Runway',
      message: `Your available funds comfortably support $${safeToSpend.safeToSpendDaily.toFixed(2)} per day with all committed expenses and savings buffers protected.`,
      metric: `Safe to spend $${safeToSpend.safeToSpendDaily.toFixed(2)}/day`,
      actionText: 'Keep it up',
      createdAt: now
    });
  }

  // 3. Goal Progress & Milestones
  const activeGoals = goals.filter(g => g.status === 'active');
  for (const goal of activeGoals) {
    const progressPct = Math.round((goal.currentAmount / goal.targetAmount) * 100);
    const remaining = goal.targetAmount - goal.currentAmount;
    
    // Check target date proximity
    const targetDate = new Date(goal.targetDate);
    const today = new Date();
    const daysLeft = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const weeksLeft = Math.max(1, Math.ceil(daysLeft / 7));
    const requiredWeekly = remaining / weeksLeft;

    if (progressPct >= 75) {
      insights.push({
        id: `ins_goal_${goal.id}`,
        userId: goal.userId,
        type: 'positive',
        title: `${goal.name}: In the Final Stretch!`,
        message: `You're ${progressPct}% of the way there! Just $${remaining.toFixed(2)} more needed to hit your target.`,
        metric: `${progressPct}% reached`,
        actionText: 'Add Contribution',
        createdAt: now
      });
    } else if (daysLeft < 30 && progressPct < 50) {
      insights.push({
        id: `ins_goal_pace_${goal.id}`,
        userId: goal.userId,
        type: 'info',
        title: `Pace Check: ${goal.name}`,
        message: `With ${weeksLeft} weeks remaining until ${goal.targetDate}, contributing $${requiredWeekly.toFixed(2)}/week will ensure you achieve this goal on time.`,
        metric: `$${requiredWeekly.toFixed(2)}/week needed`,
        actionText: 'Boost Goal',
        createdAt: now
      });
    }
  }

  // 4. Upcoming Recurring Bills Cushion
  const activeRecurring = recurring.filter(r => r.isActive);
  const totalUpcomingBills = activeRecurring.reduce((sum, r) => sum + r.amount, 0);
  if (totalUpcomingBills > 0 && safeToSpend.availableBalance > 0) {
    const billRatio = totalUpcomingBills / safeToSpend.availableBalance;
    if (billRatio > 0.4) {
      insights.push({
        id: 'ins_recurring_heavy',
        userId: budget.userId,
        type: 'warning',
        title: 'Committed Bills Take Priority',
        message: `Recurring obligations ($${totalUpcomingBills.toFixed(2)}) account for ${Math.round(billRatio * 100)}% of your remaining balance. Keep this reserved in your EcoCash or bank account.`,
        metric: `$${totalUpcomingBills.toFixed(2)} committed`,
        actionText: 'View Recurring',
        createdAt: now
      });
    }
  }

  // 5. Default encouraging tip if few insights
  if (insights.length < 2) {
    insights.push({
      id: 'ins_student_habit',
      userId: budget.userId,
      type: 'info',
      title: 'Smart Student Habit: 48-Hour Rule',
      message: 'For non-essential purchases over $10, waiting 48 hours helps prevent impulse spending on campus. 73% of impulse urges pass when delayed.',
      actionText: 'Read Wellness Tips',
      createdAt: now
    });
  }

  return insights;
}
