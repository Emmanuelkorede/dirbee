"use server";

import { and, count, eq, inArray, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";

import { db } from "@/db";
import { reviews } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import { verifyTurnstileToken } from "@/lib/security/turnstile";
import type { ActionResult } from "@/types/action";

import {
  featuredReviewIdsSchema,
  reviewIdSchema,
  submitReviewSchema,
  updateReviewSchema,
  createReviewSchema
} from "./validation";

function revalidateReviewPages() {
  revalidatePath("/", "layout"); // homepage testimonials
  revalidatePath("/reviews", "layout");
  revalidatePath("/admin/reviews", "layout");
}

//  Public: submit 

// A public submission is always saved as "pending". Only an admin can approve it.
export async function submitReviewAction(input: unknown): Promise<ActionResult> {
  // 1. Validate first so a typo does not use up the single-use Turnstile token.
  const parsed = submitReviewSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  const { turnstileToken, ...data } = parsed.data;

  // 2. Prove it's a person.
  if (!(await verifyTurnstileToken(turnstileToken))) {
    return {
      success: false,
      error: "Verification failed. Please redo the check and try again.",
    };
  }

  // 3. Save.
  try {
    await db.insert(reviews).values({
      clientName: data.clientName,
      email: data.email || null,
      role: data.role || null,
      company: data.company || null,
      reviewText: data.reviewText,
      publicationConsent: data.publicationConsent, // always true here
      status: "pending",
      submissionSource: "public_form",
    });

    revalidatePath("/admin/reviews", "layout");
    return { success: true };
  } catch (error) {
    console.error("submitReviewAction failed:", error);
    return { success: false, error: "Unable to submit your review. Please try again." };
  }
}

// Admin submission :Saved as approved, so it is live as soon as reviews are switched on in Settings.
export async function createReviewAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  const parsed = createReviewSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the review details.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  const data = parsed.data;

  try {
    // A featured review goes to the end of the featured list.
    let sortOrder = 0;
    if (data.featured) {
      const [featured] = await db
        .select({ total: count(), last: max(reviews.sortOrder) })
        .from(reviews)
        .where(eq(reviews.isFeatured, true));

      if (featured.total >= 20) {
        return { success: false, error: "You can feature at most 20 reviews. Remove one first." };
      }
      sortOrder = (featured.last ?? -1) + 1;
    }

    const [review] = await db
      .insert(reviews)
      .values({
        clientName: data.clientName,
        email: data.email || null,
        role: data.role || null,
        company: data.company || null,
        reviewText: data.reviewText,
        publicationConsent: true, // confirmed by the admin in the form
        status: "approved",
        approvedAt: new Date(),
        isFeatured: data.featured,
        sortOrder,
        submissionSource: "admin",
      })
      .returning({ id: reviews.id });

    revalidateReviewPages();
    return { success: true, data: { id: review.id } };
  } catch (error) {
    console.error("createReviewAction failed:", error);
    return { success: false, error: "Unable to add the review." };
  }
}
//  Admin: moderate 

export async function approveReviewAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const parsedId = reviewIdSchema.safeParse(id);
  if (!parsedId.success) return { success: false, error: "Invalid review." };

  try {
    const [review] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, parsedId.data))
      .limit(1);
    if (!review) return { success: false, error: "Review not found." };

    if (!review.publicationConsent) {
      return {
        success: false,
        error: "This reviewer did not agree to publication, so it cannot be approved.",
      };
    }

    await db
      .update(reviews)
      .set({
        status: "approved",
        approvedAt: review.approvedAt ?? new Date(), // keep the first approval date
      })
      .where(eq(reviews.id, review.id));

    revalidateReviewPages();
    return { success: true };
  } catch (error) {
    console.error("approveReviewAction failed:", error);
    return { success: false, error: "Unable to approve the review." };
  }
}

export async function rejectReviewAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const parsedId = reviewIdSchema.safeParse(id);
  if (!parsedId.success) return { success: false, error: "Invalid review." };

  try {
    // The database only allows featured reviews that are approved, so unfeature it too.
    const updated = await db
      .update(reviews)
      .set({ status: "rejected", isFeatured: false, approvedAt: null })
      .where(eq(reviews.id, parsedId.data))
      .returning({ id: reviews.id });

    if (updated.length === 0) return { success: false, error: "Review not found." };

    revalidateReviewPages();
    return { success: true };
  } catch (error) {
    console.error("rejectReviewAction failed:", error);
    return { success: false, error: "Unable to reject the review." };
  }
}

// Status and consent are NOT editable here. Use approve / reject.
export async function updateReviewAction(input: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = updateReviewSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the review details.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  const data = parsed.data;

  try {
    const updated = await db
      .update(reviews)
      .set({
        clientName: data.clientName,
        email: data.email || null,
        role: data.role || null,
        company: data.company || null,
        reviewText: data.reviewText,
      })
      .where(eq(reviews.id, data.id))
      .returning({ id: reviews.id });

    if (updated.length === 0) return { success: false, error: "Review not found." };

    revalidateReviewPages();
    return { success: true };
  } catch (error) {
    console.error("updateReviewAction failed:", error);
    return { success: false, error: "Unable to update the review." };
  }
}

export async function deleteReviewAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const parsedId = reviewIdSchema.safeParse(id);
  if (!parsedId.success) return { success: false, error: "Invalid review." };

  try {
    const deleted = await db
      .delete(reviews)
      .where(eq(reviews.id, parsedId.data))
      .returning({ id: reviews.id });

    if (deleted.length === 0) return { success: false, error: "Review not found." };

    revalidateReviewPages();
    return { success: true };
  } catch (error) {
    console.error("deleteReviewAction failed:", error);
    return { success: false, error: "Unable to delete the review." };
  }
}

// Pass the full list of featured reviews in display order.
// It replaces the current featured list.
export async function setFeaturedReviewsAction(
  orderedIds: unknown,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = featuredReviewIdsSchema.safeParse(orderedIds);
  if (!parsed.success) {
    return {
      success: false,
      error: z.flattenError(parsed.error).formErrors[0] ?? "Invalid list.",
    };
  }
  const ids = parsed.data;

  try {
    // Only approved reviews can be featured.
    if (ids.length > 0) {
      const approved = await db
        .select({ id: reviews.id })
        .from(reviews)
        .where(and(inArray(reviews.id, ids), eq(reviews.status, "approved")));

      if (approved.length !== ids.length) {
        return { success: false, error: "Only approved reviews can be featured." };
      }
    }

    await db.transaction(async (tx) => {
      await tx
        .update(reviews)
        .set({ isFeatured: false })
        .where(eq(reviews.isFeatured, true));

      for (const [index, id] of ids.entries()) {
        await tx
          .update(reviews)
          .set({ isFeatured: true, sortOrder: index })
          .where(eq(reviews.id, id));
      }
    });

    revalidateReviewPages();
    return { success: true };
  } catch (error) {
    console.error("setFeaturedReviewsAction failed:", error);
    return { success: false, error: "Unable to save the featured reviews." };
  }
}