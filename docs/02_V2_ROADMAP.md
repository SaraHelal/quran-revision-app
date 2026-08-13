# Quran Revision App — V2 Roadmap

**Last updated:** 14 August 2026
**Status:** In progress

## V2 Principles

* Arabic-first and RTL-first product experience
* Mobile-first responsive design
* Preserve the existing architecture where practical
* Deliver features in small, reviewable steps
* Test behaviour before marking work as complete
* Keep documentation aligned with implementation
* Avoid unnecessary overengineering

## Phase 1 — Manage Memorised Surahs

**Status:** Completed

* [x] Display the authenticated user's memorised surahs
* [x] Display loading, error, and empty states
* [x] Prevent adding the same surah more than once for the same user
* [x] Display a specific error message when the surah already exists
* [x] Hide form error messages automatically after three seconds
* [x] Open a confirmation modal before deletion
* [x] Display the selected surah name in the modal
* [x] Delete the surah from Cloud Firestore
* [x] Remove the deleted surah from local state
* [x] Disable modal actions while deletion is in progress
* [x] Display a success message containing the surah name
* [x] Hide the success message automatically after three seconds
* [x] Verify that deleted data remains absent after refresh
* [x] Edit a surah's mastery level
* [x] Edit a surah's memorisation date
* [x] Review accessibility and mobile usability for the complete page

## Phase 2 — Review Scheduling Engine

**Status:** In progress

* [x] Define review intervals for each mastery level: weak 1 day, good 3 days, and excellent 7 days
* [x] Calculate `nextReviewDate` from the latest review result
* [x] Schedule reviews from the start of the target local calendar day
* [x] Treat a missing or invalid `nextReviewDate` as immediately due
* [x] Store each completed review in `ReviewHistory`
* [x] Update mastery level, mastery score, last review date, and next review date after completion
* [x] Restore and display an unfinished review session
* [x] Allow the user to continue or cancel an unfinished review
* [x] Prevent conflicting review sessions with `ReviewConflictModal`
* [x] Order due reviews by `nextReviewDate`, mastery level, `lastReviewDate`, and surah number
* [x] Display the complete due count while showing reviews progressively
* [x] Allow the user to start an early review for any memorised surah
* [x] Filter manual review choices by surah name and available juz
* [x] Sort manual review choices by newest added or weakest mastery first
* [x] Reset the visible manual result count when search, juz, or sorting changes
* [x] Display manual review results progressively for larger collections
* [x] Classify reviews as overdue, due today, upcoming, or not scheduled
* [x] Display Arabic review timing labels in the manual review list
* [x] Keep review timing labels out of suggested-review cards to avoid repeating information
* [x] Distinguish no saved surahs, no due reviews, and no matching manual results
* [x] Verify suggested reviews, manual reviews, filters, sorting, timing labels, progressive display, and review conflicts
* [ ] Support review by juz or ayah range, not only by complete surah

## Phase 3 — Progress and Motivation

**Status:** Planned

* [ ] Add review history
* [ ] Add progress statistics
* [ ] Add a daily review streak
* [ ] Add a weekly summary
* [ ] Support weekly review-plan adjustments

## Phase 4 — Product Improvements

**Status:** Planned

* [ ] Add English localisation and language switching
* [ ] Improve accessibility across the application
* [ ] Improve loading and error states on remaining pages
* [ ] Complete end-to-end testing
* [ ] Review bundle size and introduce route-based code splitting where it provides a clear benefit
* [ ] Review performance and prepare the production release

## Next Task

Design the data model and user experience for reviewing a juz or ayah range while preserving the existing complete-surah review workflow.
