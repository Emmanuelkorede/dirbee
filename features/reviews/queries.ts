import "server-only";

import { and, asc, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { reviews } from "@/db/schema";
import { getSiteSettings } from "@/features/settings/queries";
import {
  reviewFiltersSchema,
  reviewIdSchema,
  type ReviewFilters,
} from "./validation";

// Public pages get these columns only. The reviewer's email never leaves the server.
const publicColumns = {
  id: reviews.id,
  clientName: reviews.clientName,
  role: reviews.role,
  company: reviews.company,
  reviewText: reviews.reviewText,
  approvedAt: reviews.approvedAt,
  isFeatured: reviews.isFeatured,
};

const isApproved = eq(reviews.status, "approved");

//  Public 

// Approved reviews, and only when the settings allow reviews to be shown.
export async function getPublicReviews() {
  const settings = await getSiteSettings();
  if (!settings.reviewsEnabled) return [];

  return db
    .select(publicColumns)
    .from(reviews)
    .where(isApproved)
    .orderBy(
      desc(reviews.isFeatured), // featured first
      asc(reviews.sortOrder),
      desc(reviews.approvedAt),
    );
}

// Homepage testimonials: reviews must be enabled AND allowed on the homepage.
export async function getFeaturedReviews() {
  const settings = await getSiteSettings();
  if (!settings.reviewsEnabled || !settings.showReviewsOnHomepage) return [];

  return db
    .select(publicColumns)
    .from(reviews)
    .where(and(isApproved, eq(reviews.isFeatured, true)))
    .orderBy(asc(reviews.sortOrder));
}

//  Admin (admin pages must call requireAdmin first) 

export async function getAdminReviews(filters?: ReviewFilters) {
  // An invalid filter is ignored and everything is shown.
  const parsed = reviewFiltersSchema.safeParse(filters ?? {});
  const status = parsed.success ? parsed.data.status : undefined;

  return db
    .select()
    .from(reviews)
    .where(status ? eq(reviews.status, status) : undefined)
    .orderBy(desc(reviews.submittedAt));
}

export async function getReviewById(id: string) {
  if (!reviewIdSchema.safeParse(id).success) return null;

  const [review] = await db
    .select()
    .from(reviews)
    .where(eq(reviews.id, id))
    .limit(1);

  return review ?? null;
}