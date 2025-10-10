'use server';

import { ExpenseRecord, generateAIAnswer } from "@/lib/ai";
import { getRecentExpenses } from "@/lib/getRecentExpenses";
import { checkUser } from "@/lib/checkUser";

export default async function generateInsightAnswer(question: string): Promise<string> {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get user's recent expenses (last 30 days)
    const expenses = await getRecentExpenses(user.clerkUserId);

    // Convert to format expected by AI
    const expenseData: ExpenseRecord[] = expenses.map(expense => ({
      id: expense.id,
      amount: expense.amount,
      category: expense.category || 'Other',
      description: expense.text,
      date: expense.createdAt.toISOString(),
    }));

    // Generate AI answer
    const answer = await generateAIAnswer(question, expenseData);
    return answer;
  } catch (error) {
    console.error('Error generating insight answer: ', error);
    return "Unable to provide a detailed answer at the moment — please try refreshing the insights or check your connection.";
  }
}