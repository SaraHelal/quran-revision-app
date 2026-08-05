# Quran Revision App

A mobile-first web application that helps Arabic-speaking users organise Quran memorisation and maintain a consistent revision routine.

The interface is intentionally Arabic-first and right-to-left (RTL). The project documentation and codebase use English to support collaboration, maintainability, portfolio presentation, and technical interviews.

## Project Status

**V2 is currently in development.**

The core application is working. Current development focuses on managing memorised surahs and expanding the revision workflow.

## Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Firebase Authentication
- Cloud Firestore

## Completed Features

- [x] Sign in with Google
- [x] Create and load user-specific data
- [x] Protect authenticated routes
- [x] Display an Arabic RTL dashboard
- [x] Add a memorised surah with input validation
- [x] Display the current user's memorised surahs
- [x] Select three priority surahs for revision
- [x] Record a revision result and update mastery data
- [x] Delete a surah through a confirmation modal
- [x] Prevent duplicate deletion requests
- [x] Update the list immediately after successful deletion
- [x] Display a success message that disappears automatically
- [x] Persist deletion in Cloud Firestore

## In Progress

- [ ] Edit a surah's mastery level from the **My Surahs** page
- [ ] Edit a surah's memorisation date
- [ ] Review the complete page on mobile devices

## Planned Features

- Revision by juz or ayah range
- Spaced revision scheduling with `nextReviewDate`
- Revision history and progress statistics
- Daily revision streak
- Weekly summary and planning
- English localisation

## Product and Engineering Decisions

- The application UI is Arabic-first because the initial target users are Arabic speakers.
- Project documentation, identifiers, and technical communication use English.
- The interface is designed mobile-first and enhanced for larger screens.
- Firestore stores persistent user data; local React state provides immediate interface updates.
- Potentially destructive actions require explicit confirmation.
- Features are implemented and tested incrementally to keep the code easy to review.

## Documentation

- [`docs/02_V2_ROADMAP.md`](docs/02_V2_ROADMAP.md) â€” V2 phases, progress, and next tasks
- [`docs/99_PROJECT_CONTEXT.md`](docs/99_PROJECT_CONTEXT.md) â€” product context, architecture, data models, implementation notes, and current status
