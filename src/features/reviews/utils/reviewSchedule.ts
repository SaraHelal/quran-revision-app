import type { MasteryLevel, ReviewStatus } from "../../../types";

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

  nextReviewDate.setHours(0, 0, 0, 0);

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
export function getReviewDateStatus(
  nextReviewDate: string | null,
  currentDate: Date = new Date(),
): ReviewStatus {
  if (!nextReviewDate) {
    return "notScheduled";
  }

  const reviewDate = new Date(nextReviewDate);

  if (Number.isNaN(reviewDate.getTime())) {
    return "notScheduled";
  }

  const normalizedReviewDate = new Date(reviewDate);
  const normalizedCurrentDate = new Date(currentDate);

  normalizedReviewDate.setHours(0, 0, 0, 0);
  normalizedCurrentDate.setHours(0, 0, 0, 0);

  const reviewTimestamp = normalizedReviewDate.getTime();
  const currentTimestamp = normalizedCurrentDate.getTime();

  if (reviewTimestamp === currentTimestamp) {
    return "dueToday";
  }

  if (reviewTimestamp > currentTimestamp) {
    return "upcoming";
  }

  return "overdue";
}