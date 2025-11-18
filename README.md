# Instaflan Frontend

This directory hosts the Next.js frontend for Instaflan, so this README mirrors the root README’s structure (intro → use cases → modules) while focusing squarely on the client-side experience. The project fuses the social flows described in the root `README.md` with a modern React UI, Tailwind theme, and Turbopack dev server.

## Project Overview

- **Purpose:** Recreate the Instagram-like timeline, profile, messaging, and discovery flows while keeping developer workflows tight enough for experimentation.
- **Stack:** Next.js 15 App Router + Turbopack, client components with hooks, Tailwind CSS for theming, and integrations such as Next Image, Cloudinary upload widgets, and ESLint 9 flat configs.
- **UX philosophy:** Each action (favorite post, send message, toggle follow) is guarded by error handling that routes failures through the shared `error-modal` via `useModal`, so the toast-like modal is the canonical place for reporting API problems.

## Frontend Highlights

- **Shared modal layer:** `src/context/ModalContext.tsx` exposes `openModal`/`closeModal`, powers every modal screen (create post/comment, edit user/post, followers/following, error alerts) and keeps callbacks typed for safe use.
- **Feed & interactions:** `app/(main)/home`, `explorer`, and profile tabs load posts via API helpers, update optimistic state inside `startTransition`, and keep hooks clean by tracking dependencies (`openModal`, route parameters).
- **Messaging & notifications:** Chat routes poll the backend every few seconds, guard transitions with `startTransition`, and show editable/deletable messages through modal wrappers.
- **User exploration:** The explorer index fetches suggested users and posts, while the `UsersSearchModal` uses `searchUser` and will open the error modal whenever a read fails.
- **Responsive UI:** The `NavBar`, `Header`, and individual cards use Tailwind utilities for mobile & desktop, gradients, and sticky/fixed positioning so navigation feels native.

## Getting Started

```bash
cd app-next
npm install
npm run dev   # Turbopack dev server at http://localhost:3000
```

Other useful scripts:

- `npm run lint` – runs ESLint with the flat config that imports `next/core-web-vitals` and `next/typescript` via `@eslint/eslintrc`’s `FlatCompat`.
- `npm run build` / `npm start` – standard Next.js production lifecycle once the backend API and env vars are configured.

## Directory Highlights

- `src/app/(main)` – home, explorer, messages, notifications, and profile layouts that bubble data through the shared modal context.
- `src/app/components` – UI primitives such as `Post`, `NavBar`, `Header`, and modal implementations that hook into `useModal` for consistent error handling.
- `src/lib/api` – wrappers (`retrievePosts`, `toggleFavPost`, `sendMessage`, etc.) that correspond to the API routes defined in the sibling backend module.
- `src/app/api/sign-cloudinary-params` – Cloudinary signing endpoint used by the upload widget inside the `CreatePostModal`/`EditPostModal`.
- `src/context/ModalContext.tsx` – the single source of truth for modal state, ensuring every component can open the error modal with a typed `message`.

## Linting

- `npm run lint` – validates the frontend with ESLint 9, Next.js shared configs, and the custom flat config setup that now imports `next/core-web-vitals`/`next/typescript` through `FlatCompat`.
- All catch blocks funnel errors into `openModal("error-modal", { message })`, so unused variable warnings are eliminated and errors stay visible to users.
