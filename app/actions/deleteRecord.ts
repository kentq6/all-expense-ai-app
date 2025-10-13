'use server';

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function deleteRecord(recordId: string): Promise<{
  message?: string;
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'user not found' };
  }

  try {
    await db.record.delete({
      where: {
        id: recordId,
        userId,
      },
    });

    revalidatePath('/');

    return { message: 'Record deleted '};
  } catch (error) {
    console.error("Error deleting records: ", error); // Log the error
    return { error: "Database error" };
  }
}
