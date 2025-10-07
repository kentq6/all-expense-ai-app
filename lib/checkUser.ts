import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export const checkUser = async () => {
  // Checks if user is logged in
  const user = await currentUser();
  if (!user) {
    return null;
  }

  // Check if user exists (returning user)
  const loggedInUser = await db.user.findUnique({
    where: {
      clerkUserId: user.id,
    }
  });
  if (loggedInUser) {
    return loggedInUser;
  }
  // Creates new user
  const newUser = await db.user.create({
    data: {
      clerkUserId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0]?.emailAddress,
    }
  });

  return newUser;
}