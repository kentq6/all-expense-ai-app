'use server';

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface RecordData {
  text: string;
  amount: number;
  category: string;
  date: string; // Added date field
}

interface RecordResult {
  data?: RecordData;
  error?: string;
}

export default async function addExpenseRecord(formData: FormData): Promise<RecordResult> {
  const { text: textValue, amount: amountValue, category: categoryValue, date: dateValue } = {
    text: formData.get('text'),
    amount: formData.get('amount'),
    category: formData.get('category'),
    date: formData.get('date')
  };

  // Check for input values
  if (!textValue || !amountValue || !categoryValue || !dateValue) {
    return { error: 'Text, amount, category, or date is missing' };
  }

  const text: string = textValue.toString(); // Ensure text is a string
  const amount: number = parseFloat(amountValue.toString()); // Parse amount as number
  const category: string = categoryValue.toString(); // Ensure category is a string
  // Convert date to ISO-8601 format while preserving the user's input date
  let date: string;
  try {
    // Parse the date string (YYYY-MM-DD format) and create a data at noon UTC to avoid timezone issues
    const inputDate = dateValue.toString();
    
    const [year, month, day] = inputDate.split('-');
    const dateObj = new Date(
      Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0)
    );
    date = dateObj.toISOString();
  } catch (error) {
    console.error('Invalid date format: ', error); // log the error
    return { error: 'Invalid date format.' };
  }

  // Get logged in user
  const { userId } = await auth();
  // Check if user is logged in
  if (!userId) {
    return { error: 'User not found' };
  }

  try {
    // Create a new record (allow multiple expenses per day)
    const createdRecord = await db.record.create({
      data: {
        text,
        amount,
        category,
        date, // Save the date to the database
        userId,
      },
    });

    const recordData: RecordData = {
      text: createdRecord.text,
      amount: createdRecord.amount,
      category: createdRecord.category,
      date: createdRecord.date?.toISOString() || date,
    };

    revalidatePath('/');

    return { data: recordData };
  } catch (error) {
    console.error('Error adding expense record: ', error); // Log the error
    return {
      error: 'An unexpected error occurred while adding the expense record.',
    };
  }
}
