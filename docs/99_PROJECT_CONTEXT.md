# Quran Revision App — Project Context

**Last updated:** 5 August 2026  
**Current version:** V2 — In progress

## Product Goal

The Quran Revision App helps users organise Quran memorisation and maintain a consistent revision routine. The product is designed for Arabic-speaking users, so the application interface is Arabic-first, right-to-left (RTL), responsive, and mobile-first. English localisation is planned for a later version.

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

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Firebase Authentication
- Cloud Firestore

## Core Data Models

### `MemorizationUnit`

- `id`
- `userId`
- `surahNumber`
- `surahName`
- `juzNumber`
- `masteryLevel`
- `masteryScore`
- `lastReviewDate`
- `nextReviewDate`
- `createdAt`
- `updatedAt`

### `ReviewHistory`

- `id`
- `userId`
- `memorizationUnitId`
- `reviewDate`
- `result`
- `scoreAfterReview`
- `createdAt`

## Completed Features

- [x] Google authentication and user document creation
- [x] Protected application routes
- [x] Arabic RTL dashboard
- [x] Mobile-first responsive interface
- [x] Add a memorised surah with input validation
- [x] Display the authenticated user's memorised surahs
- [x] Select three priority surahs based on mastery level
- [x] Record a revision result and refresh the related data
- [x] Restrict users to their own data through Firestore Security Rules
- [x] Delete a memorised surah safely

## Delete Surah Feature

**Status:** Complete and verified

### Behaviour

- A delete action selects the target surah without deleting it immediately.
- A confirmation modal displays the selected surah name dynamically.
- The modal explains that the deleted surah cannot be restored through the interface.
- The user can confirm or cancel the action.
- Both modal buttons are disabled while the Firestore request is in progress.
- The confirm button displays a loading message during deletion.
- After a successful request, the deleted item is removed from local state immediately.
- A success message includes the deleted surah name.
- The success message disappears automatically after three seconds.
- Errors are shown to the user and logged for debugging.

### Implementation Notes

- The service deletes the Firestore document using the authenticated `userId` and the memorisation unit `id`.
- The event handler is passed as `onClick={handleConfirmDelete}` because it does not require arguments.
- The modal overlay uses `bg-black/50`, which applies transparency only to the background.
- `isDeleting` prevents duplicate requests and keeps modal state consistent.
- A `useEffect` creates the success-message timer and clears it during cleanup.
- Local state is updated after Firestore succeeds, providing immediate UI feedback while Firestore remains the persistent data source.

### Verification

- [x] The correct surah name appears in the confirmation modal.
- [x] Cancel closes the modal without deleting data.
- [x] Confirm deletes the document from Firestore.
- [x] The item disappears from the interface immediately.
- [x] The success message appears and disappears after three seconds.
- [x] The deleted item remains absent after a browser refresh.

## Current Focus

The **My Surahs** page currently supports loading, empty, error, list, success, and safe deletion states.

Next planned work:

1. Edit a surah's mastery level.
2. Edit its memorisation date.
3. Review the complete page experience on mobile devices.
