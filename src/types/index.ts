export type MasteryLevel =
| "excellent"
| "good"
| "weak";

export interface MemorizationUnit {
  id: string;
  userId: string;

  surahNumber: number;
  surahName: string;
  juzNumber: number;

  memorizedAt: string;

  masteryLevel: MasteryLevel;
  masteryScore: number;

  lastReviewDate: string | null;
  nextReviewDate: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateMemorizationUnitData {
    surahNumber: number;
    surahName: string;
    juzNumber: number;
    memorizedAt: string;
    masteryLevel: MasteryLevel;
}

export interface AppUser {
uid: string;
displayName: string;
email: string;
photoURL: string | null;

createdAt: string;
updatedAt: string;

totalSurahs: number;
streakDays: number;
}

export type ReviewResult =
| "excellent"
| "good"
| "weak";

export interface ReviewHistory {
id: string;
userId: string;
memorizationUnitId: string;

reviewDate: string;
result: ReviewResult;
scoreAfterReview: number;

createdAt: string;
}
