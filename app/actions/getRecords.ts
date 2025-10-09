'use server';

import { db } from '@/lib/db';
import { Record } from '@/types/Record';
import { auth } from '@clerk/nextjs/server';

export default async function getRecords(): Promise<{
  records? :Record[];
  error?: string;
}> {
  // Get logged in user
  const { userId } = await auth();
  if (!userId) {
    return { error: 'User not found' };
  }

  try {
    // Query for the last 10 records for the user
    const records = await db.record.findMany({
      where: { userId },
      orderBy: { date: 'desc', }, // Sort by the 'date' field in descending order
      take: 10, // Limit to the last 10 records
    });

    return { records };
  } catch (error) {
    console.error('Error getting records: ', error);
    return { error: 'Database error' };
  }
}
