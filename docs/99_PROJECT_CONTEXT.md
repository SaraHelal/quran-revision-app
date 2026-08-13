# Quran Revision App — Project Context

**Last updated:** 14 August 2026
**Current version:** V2 — Phase 2 in progress

## Product Goal

The Quran Revision App helps users organise Quran memorisation and maintain a consistent review routine. The product is designed for Arabic-speaking users, so the application interface is Arabic-first, right-to-left (RTL), responsive, and mobile-first. English localisation is planned for a later version.

The current product experience combines automated review recommendations with user choice. The application identifies due surahs and orders them by priority, while still allowing the user to review any memorised surah early.

## Development Workflow

Features are developed using the following workflow:

1. Define the problem.
2. Design the user experience.
3. Review architecture and data requirements.
4. Implement the feature in small, testable steps.
5. Review and refactor the code.
6. Update project documentation.

The current architecture is preserved unless a change provides a clear benefit. Unnecessary complexity and premature abstraction are avoided.

## Technology Stack

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Firebase Authentication
* Cloud Firestore

## Core Data Models

### `MemorizationUnit`

* `id`
* `userId`
* `surahNumber`
* `surahName`
* `juzNumber`
* `memorizedAt`
* `masteryLevel`
* `masteryScore`
* `lastReviewDate`
* `nextReviewDate`
* `createdAt`
* `updatedAt`

### `ReviewHistory`

* `id`
* `userId`
* `memorizationUnitId`
* `reviewDate`
* `result`
* `scoreAfterReview`
* `createdAt`

## Completed Foundation

* [x] Google authentication and user document creation
* [x] Protected application routes
* [x] Arabic RTL dashboard
* [x] Mobile-first responsive interface
* [x] Add a memorised surah with input validation
* [x] Prevent duplicate memorisation units
* [x] Display, edit, and safely delete memorised surahs
* [x] Restrict users to their own data through Firestore Security Rules
* [x] Display loading, error, empty, success, and confirmation states

## Review Scheduling Engine

**Status:** Implemented and verified for complete-surah reviews

### Review intervals

The current scheduling intervals are:

| Mastery level | Next review |
| ------------- | ----------: |
| Weak          |       1 day |
| Good          |      3 days |
| Excellent     |      7 days |

`nextReviewDate` is scheduled at the start of the target local calendar day and stored as an ISO UTC timestamp. A missing or invalid next-review date is treated as immediately due.

### Due-review priority

Due surahs are ordered using the following deterministic priority:

1. Oldest `nextReviewDate` first.
2. Weakest `masteryLevel` when due dates are equal.
3. Oldest `lastReviewDate` when both previous values are equal.
4. Lowest `surahNumber` as the final stable tie-breaker.

The dashboard count represents every due surah. The interface initially displays three due surahs and reveals three more with each **Show more** action. This prevents a large backlog from making the dashboard unnecessarily long.

### Review timing status

The application classifies each saved surah using its `nextReviewDate`:

* `overdue` — the scheduled review date is before today;
* `dueToday` — the review is scheduled for the current local calendar day;
* `upcoming` — the review is scheduled for a future day;
* `notScheduled` — the surah does not have a valid next-review date and is presented as a first review.

Date classification compares local calendar days rather than exact times. This prevents different times on the same day from producing different statuses.

The internal status values remain in English, while the Arabic interface displays:

* متأخرة
* مستحقة اليوم
* قادمة
* مراجعة أولى

Timing labels are displayed only in the manual review list. They are not displayed in suggested-review cards because every card in that section already represents a review that should be completed now. This avoids repeating information and keeps suggested-review cards focused.

### Completing a review

Completing a review:

* stores a new `ReviewHistory` record;
* updates `masteryLevel` and `masteryScore`;
* stores the completion time in `lastReviewDate`;
* calculates and stores the new `nextReviewDate`;
* clears the active review from local storage.

### Unfinished and conflicting reviews

The current review unit ID is stored in local storage under `activeReviewUnitId`. The dashboard restores the unfinished review and displays `ActiveReviewCard`, allowing the user to continue or cancel it.

If the user tries to start a different surah while a review is active, `ReviewConflictModal` offers three choices:

* continue the current review;
* replace it with the newly selected review;
* close the modal without changing either selection.

## Dashboard Review Experience

The review section has two modes.

### Suggested reviews

* Shows only surahs whose `nextReviewDate` is due.
* Uses the multi-step priority order described above.
* Displays the full due count in the dashboard statistics.
* Displays due cards vertically and progressively in groups of three.
* Shows separate states for no memorised surahs and no reviews due today.
* Does not repeat review timing labels inside the cards.

### Manual review selection

* Allows early review of any memorised surah.
* Searches by partial surah name.
* Filters by juz.
* Shows only juz numbers represented in the user's saved surahs.
* Combines the search and juz filters.
* Allows results to be sorted by most recently added or weakest mastery first.
* Uses the most recently added order as the default.
* Uses the most recently added date as the tie-breaker when multiple surahs have the same mastery level.
* Displays review timing labels for overdue, due-today, upcoming, and first-review surahs.
* Displays results progressively in groups of five.
* Resets the visible result count when the search, juz, or sorting option changes.
* Shows a specific no-matching-results state.
* Uses the same active-review conflict protection as suggested reviews.

The separate **My Surahs** page remains focused on managing saved data through editing and deletion.

## Verification Status

* [x] Suggested review opens the correct surah
* [x] Manual review opens the correct surah
* [x] Partial-name search filters results
* [x] Juz selection filters results
* [x] Search and juz filters work together
* [x] Manual results can be sorted by newest or weakest first
* [x] The manual result count resets when sorting changes
* [x] Overdue, due-today, upcoming, and first-review statuses are classified correctly
* [x] Review timing labels display in Arabic in the manual review list
* [x] No-result and empty-data states are distinct
* [x] Suggested reviews expand and collapse correctly
* [x] Manual results expand and collapse correctly
* [x] Active-review conflicts display the expected modal
* [x] Missing `nextReviewDate` is treated as due
* [x] Lint checks pass
* [x] Production build completes successfully

## Build Note

The production build succeeds. Vite currently reports that a minified chunk exceeds 500 kB. This is a non-blocking performance warning. Bundle analysis and route-based code splitting are deferred to Phase 4 to avoid premature optimisation during the review-engine implementation.

## Current Focus

The complete-surah scheduling and manual-selection experience is implemented and verified. The next Phase 2 task is to design support for reviewing a juz or ayah range without disrupting the existing complete-surah workflow.
