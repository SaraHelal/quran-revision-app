# Quran Revision App - Project Context

## Project Name

Quran Revision App

## Project Purpose

This app helps Quran memorizers organize and track their revision, especially when they start forgetting which surahs are becoming weak or have not been reviewed recently.

The idea came from a real personal problem: Quran revision can become random and hard to manage as memorization grows. The goal is to help the developer first, then help other Quran memorizers build a consistent revision habit.

## Current Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Firebase Authentication
- Cloud Firestore

## Current Architecture

The project is organized using a feature-based structure.

```text
src
├── assets
├── components
├── constants
├── features
│   ├── auth
│   ├── dashboard
│   ├── memorization
│   └── reviews
├── hooks
├── layouts
├── pages
├── services
│   └── firebase
├── types
└── utils

Firebase Setup

Firebase has been created and connected.

Enabled services:

Google Authentication
Firestore Database

Firestore collections planned:

users
memorizationUnits
reviewHistory
Completed So Far
Created React project using Vite
Added TypeScript
Installed Tailwind CSS
Created project folder structure
Created TypeScript types
Created Firebase constants
Created Firebase project
Enabled Google Authentication
Created Firestore Database
Connected Firebase SDK
Implemented Google Sign-In
Saved new users automatically to Firestore
Created basic Dashboard page
Created initial documentation files
Important Decisions
Decision 1: Start with Web App / PWA

We decided to start with a React web app using Vite because it is faster, simpler, and works well on mobile browsers. Later, the app can become a PWA or be rebuilt in React Native if needed.

Decision 2: Use Firebase

Firebase is used as the backend because it provides Authentication and Firestore quickly without building a custom backend.

Decision 3: Start with Surah-level Revision

The MVP will start with full-surah revision because it is simpler. The database is still designed with the name memorizationUnits so we can later support ayah ranges or pages.

Decision 4: Documentation-first workflow

We are documenting the project as we build it so the project can be resumed easily in any future chat or development session.

Current MVP

Version 1.0 focuses on:

Google Sign In
Logout
Dashboard
Add Surah
Display memorized surahs
Today’s revision
Save review result
Save review history

## Current Status

Authentication and Routing foundations are complete.

Implemented:

- Google Authentication
- Firestore
- useAuth Hook
- React Router
- ProtectedRoute
- Nested Routes
- Login Redirect
- Dashboard Redirect
- Mobile-first Dashboard UI

Current Focus:
Dashboard improvements and Add Surah feature.


Next Steps
Add React Router
Create app layout
Add protected routes
Improve Dashboard
Add Logout
Build Add Surah feature
Working Style

The project is being built like a real software engineering project:

Understand the problem
Design the UX
Design the data
Write the types
Build the feature
Review the code
Update documentation
Notes for Future Chat

If this project continues in a new ChatGPT conversation, start by sharing this file.

The assistant should act as a Tech Lead and guide the developer step by step, explaining decisions and reviewing code like a real project.


## V1 Completed

The app now supports a usable first version.

Implemented in V1:

* Google Sign In
* Logout
* Protected routes
* Arabic RTL mobile-first Dashboard
* Dynamic user name in Dashboard
* Add Surah page
* Save memorized surahs to Firestore `memorizationUnits`
* Fetch user memorized surahs from Firestore
* Show total memorized surahs count
* Show today’s suggested review items
* Prioritize weaker surahs first:

  * weak
  * good
  * excellent
* Update mastery level after review
* Save review history to Firestore `reviewHistory`
* Show review success feedback message
* Replace “Overdue” stat with “Weak” count for V1
* Add placeholder card for future “Manage Memorized Surahs”

## V1 Firestore Collections

### users

Stores authenticated users.

### memorizationUnits

Stores user memorized surahs and their current revision state.

Important fields:

* userId
* surahName
* surahNumber
* juzNumber
* memorizedAt
* masteryLevel
* masteryScore
* lastReviewDate
* nextReviewDate
* createdAt
* updatedAt

### reviewHistory

Stores every review action.

Important fields:

* userId
* memorizationUnitId
* reviewDate
* result
* scoreAfterReview
* createdAt

## Current Dashboard Logic

Dashboard fetches the current user’s memorization units from Firestore.

Stats:

* ورد اليوم = number of current suggested review items
* ضعيف = number of weak surahs
* محفوظ = total memorized surahs

Today’s review currently prioritizes weaker surahs first using:

weak = 1
good = 2
excellent = 3

Only the top 3 are shown in V1.

## Current Review Logic

When the user selects a review result:

* The memorization unit masteryLevel is updated.
* lastReviewDate is updated.
* updatedAt is updated.
* A new reviewHistory document is created.
* Dashboard reloads the updated surahs.

## Next V2 Ideas

* Better Add Surah UX:

  * Select surah from a dropdown.
  * Auto-fill surah number.
  * Auto-fill juz number.
  * Optionally filter surahs by juz.
* Manage Memorized Surahs page.
* Real nextReviewDate scheduling.
* Overdue reviews.
* Review statistics.
* Streak days.
* PWA/mobile deployment.
## Deferred Improvements

### Prevent Duplicate Surahs

Problem:
The user can currently add the same surah more than once.

Desired behavior:
Before creating a new memorizationUnit, check if a document already exists for:

* userId
* surahNumber

If the surah already exists:

* Do not create a new document.
* Show a friendly message:

"هذه السورة مضافة بالفعل 🌿"

Implementation idea:
Add the duplicate check inside:

src/features/memorization/services/memorizationService.ts

Reason for postponing:
The current V1 is already usable, and duplicate prevention can safely be added in V2 without affecting the existing data model.
