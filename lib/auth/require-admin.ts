
import "server-only";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/server";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";

export async function requireAdmin() {
  // Check whether someone is signed in.
  const { data : session } = await auth.getSession();
    console.log("Signed-in user ID:", session?.user.id);


  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  // Check whether this specific account is in our admin allowlist.
  const [admin] = await db
    .select({
      authUserId: adminUsers.authUserId,
    })
    .from(adminUsers)
    .where(eq(adminUsers.authUserId, session.user.id))
    .limit(1);

  if (!admin) {
    // Signed in, but not authorized to manage House of Bee.
    redirect("/");
  }

  return session.user;

}
