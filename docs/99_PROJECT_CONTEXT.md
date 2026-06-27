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


