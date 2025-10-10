import { db } from "./db";

export async function getRecentExpenses(userId: string) {
  // Get user's recent expenses (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const expenses = await db.record.findMany({
    where: {
      userId,
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50, // Limit to recent 50 expenses for analysis
  });

  return expenses;
}