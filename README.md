# Quran Revision App

A mobile-first web application that helps Arabic-speaking users organise Quran memorisation and maintain a consistent review routine.

The interface is intentionally Arabic-first and right-to-left (RTL). The project documentation and codebase use English to support collaboration, maintainability, portfolio presentation, and technical interviews.

## Project Status

**V2 is currently in development.**

Management of memorised surahs is complete. The current version also supports scheduled complete-surah reviews, unfinished review recovery, priority-based recommendations, and manual review selection.

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
- [x] Provide a mobile-first responsive interface
- [x] Add a memorised surah with input validation
- [x] Prevent duplicate memorised surahs
- [x] Display the authenticated user's memorised surahs
- [x] Edit a surah's mastery level and memorisation date
- [x] Delete a surah safely through a confirmation modal
- [x] Display immediate success, error, loading, and empty states
- [x] Persist all memorisation data in Cloud Firestore
- [x] Record completed reviews in `ReviewHistory`
- [x] Update mastery and scheduling data after each completed review
- [x] Restore, continue, or cancel an unfinished review
- [x] Prevent conflicting review sessions
- [x] Recommend every due surah using deterministic priority rules
- [x] Display large due-review collections progressively
- [x] Allow an early manual review of any saved surah
- [x] Search manual review choices by partial surah name
- [x] Filter manual review choices by available juz
- [x] Display large manual-review result sets progressively

## Review Scheduling

The current complete-surah scheduling intervals are:

| Mastery level | Next review |
| --- | ---: |
| Weak | 1 day |
| Good | 3 days |
| Excellent | 7 days |

The next review is scheduled from the start of the target local calendar day and stored as an ISO UTC timestamp.

Due reviews are ordered by:

1. oldest `nextReviewDate`;
2. weakest mastery level;
3. oldest `lastReviewDate`;
4. lowest surah number as a stable final tie-breaker.

A missing or invalid `nextReviewDate` is treated as immediately due.

## Review Experience

The dashboard supports two review paths:

- **Suggested reviews:** due surahs ordered by priority and displayed progressively in groups of three.
- **Manual reviews:** any saved surah, searchable by name and filterable by the user's available juz numbers, displayed progressively in groups of five.

An unfinished review is stored in local storage and restored on the dashboard. Starting a different review opens a conflict modal that allows the user to continue the active review, replace it, or close the modal without making a change.

## In Progress

- [ ] Display clear overdue, due-today, and upcoming review labels
- [ ] Support review by juz or ayah range, not only by complete surah

## Planned Features

- Review history interface and progress statistics
- Daily review streak
- Weekly summary and planning
- Weekly review-plan adjustments
- English localisation and language switching
- End-to-end testing
- Bundle analysis and code splitting where beneficial

## Product and Engineering Decisions

- The application UI is Arabic-first because the initial target users are Arabic speakers.
- Project documentation, identifiers, and technical communication use English.
- The interface is designed mobile-first and enhanced for larger screens.
- Firestore stores persistent user data; local React state provides immediate interface updates.
- Potentially destructive actions require explicit confirmation.
- Review recommendations prioritise overdue work without preventing optional early reviews.
- Large review collections use progressive disclosure to keep the dashboard usable.
- Features are implemented and tested incrementally to keep the code easy to review.
- Performance optimisation is deferred until it provides a measurable benefit.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run the linter:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

The current production build completes successfully. Vite reports a non-blocking warning for a minified chunk larger than 500 kB; bundle analysis and code splitting are planned for the later performance phase.

## Documentation

- [`docs/02_V2_ROADMAP.md`](docs/02_V2_ROADMAP.md) — V2 phases, progress, and next tasks
- [`docs/99_PROJECT_CONTEXT.md`](docs/99_PROJECT_CONTEXT.md) — product context, architecture, data models, implementation notes, and current status
