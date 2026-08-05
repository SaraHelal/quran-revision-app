# Quran Revision App — V2 Roadmap

**Last updated:** 5 August 2026  
**Status:** In progress

## V2 Principles

- Arabic-first and RTL-first product experience
- Mobile-first responsive design
- Preserve the existing architecture where practical
- Deliver features in small, reviewable steps
- Test behaviour before marking work as complete
- Keep documentation aligned with implementation
- Avoid unnecessary overengineering

## Phase 1 — Manage Memorised Surahs

**Status:** In progress

- [x] Display the authenticated user's memorised surahs
- [x] Display loading, error, and empty states
- [x] Prevent adding the same surah more than once for the same user
- [x] Display a specific error message when the surah already exists
- [x] Hide form error messages automatically after three seconds
- [x] Open a confirmation modal before deletion
- [x] Display the selected surah name in the modal
- [x] Delete the surah from Cloud Firestore
- [x] Remove the deleted surah from local state
- [x] Disable modal actions while deletion is in progress
- [x] Display a success message containing the surah name
- [x] Hide the success message automatically after three seconds
- [x] Verify that deleted data remains absent after refresh
- [x] Edit a surah's mastery level
- [x] Edit a surah's memorisation date
- [ ] Review accessibility and mobile usability for the complete page## Phase 2 — Spaced Revision System

**Status:** Planned

- [ ] Calculate `nextReviewDate` from the latest revision result
- [ ] Prioritise today's reviews by due date and mastery level
- [ ] Support revision by juz or ayah range, not only by complete surah
- [ ] Store each completed revision in `ReviewHistory`
- [ ] Distinguish overdue, due today, and upcoming revisions

## Phase 3 — Progress and Motivation

**Status:** Planned

- [ ] Add revision history
- [ ] Add progress statistics
- [ ] Add a daily revision streak
- [ ] Add a weekly summary
- [ ] Support weekly revision-plan adjustments

## Phase 4 — Product Improvements

**Status:** Planned

- [ ] Add English localisation and language switching
- [ ] Improve accessibility across the application
- [ ] Improve loading and error states on remaining pages
- [ ] Complete end-to-end testing
- [ ] Review performance and prepare the production release

## Next Task

Design and implement mastery-level editing on the **My Surahs** page. Verify that the updated value is stored in Cloud Firestore and remains correct after refreshing the browser.
