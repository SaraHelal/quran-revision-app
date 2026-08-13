import type { MasteryLevel } from "../../../types";

const REVIEW_INTERVAL_DAYS: Record<MasteryLevel, number> = {
  weak: 1,
  good: 3,
  excellent: 7,
};

export function calculateNextReviewDate(
  masteryLevel: MasteryLevel,
  reviewedAt: Date,
): string {
  const nextReviewDate = new Date(reviewedAt);

  nextReviewDate.setDate(
    nextReviewDate.getDate() + REVIEW_INTERVAL_DAYS[masteryLevel],
  );

  return nextReviewDate.toISOString();
}

export function isReviewDue(
  nextReviewDate: string | null,
  currentDate: Date = new Date(),
): boolean {
  if (!nextReviewDate) {
    return true;
  }

  const reviewDate = new Date(nextReviewDate);

  if (Number.isNaN(reviewDate.getTime())) {
    return true;
  }

  return reviewDate.getTime() <= currentDate.getTime();
}