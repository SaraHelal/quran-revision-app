# Decision 5

Use React Router with nested protected routes.

Reason:
- Keeps App.tsx clean.
- Makes routes scalable.
- Avoids repeating authentication logic.
- Easier maintenance as the project grows.

---

# Decision 6

Start with a mobile-first dashboard.

Reason:
- Most users will use the app on their phones.
- Easier to scale up to tablets and desktop later.

---

# Decision 7

Keep /login public for MVP.

Reason:
- Simpler implementation.
- Added redirect to dashboard if the user is already authenticated.
- GuestRoute can be introduced later if needed.