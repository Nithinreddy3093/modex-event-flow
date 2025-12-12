EventWave — Frontend (modex-event-flow / eventwave-main)

EventWave is a modern Next.js + TypeScript frontend for the Modex Ticket Booking System assignment.
This repo contains the frontend application used to browse events, view seat maps, and book seats. It’s designed to integrate with a backend API (Node.js / Express / Postgres) that implements seat-level booking with concurrency controls.

Table of Contents

Live Demo

Features

Tech stack

Prerequisites

Quickstart — Local development

Environment variables

Available scripts

Deployment

Firebase Hosting (preferred for this repo)

Vercel / Netlify alternative

Folder structure

Connecting to the backend API

Testing / Concurrency demo tips

Assumptions & Known limitations

How to contribute

License & contact

Live Demo

Add your deployed frontend URL here once deployed (e.g. https://ticketme.netlify.app/)

Features

Events list (cards) with date/time and “Book Seats” links

Admin view to create shows/trips

Seat grid UI for selecting seats visually

Booking flow that shows PENDING, CONFIRMED, and FAILED states

Countdown for PENDING bookings (driven by expires_at)

Basic form validation and error handling

React Context API for global state (mock auth + shows cache)

Clean, responsive UI with TailwindCSS

Tech stack

Next.js (App Router) + TypeScript

React + React Context API

Tailwind CSS

Node-style build & scripts (npm)

Firebase Hosting configuration included (apphosting.yaml) — ready for Firebase deployment

Prerequisites

Node.js (LTS recommended — 18+)

npm (or yarn)

(For Firebase deployment) Firebase CLI (npm i -g firebase-tools) and a Firebase project

Quickstart — Local development

Clone the repo

git clone https://github.com/Nithinreddy3093/modex-event-flow.git
cd modex-event-flow/eventwave-main


Install dependencies

npm install


Create environment file from example

cp .env.example .env.local
# open .env.local and set NEXT_PUBLIC_API_BASE_URL to your backend URL


Start dev server

npm run dev
# app will be available at http://localhost:3000

Environment variables

Create a .env.local in the project root (this repo uses standard Next.js environment files). Example:

# .env.example
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
NEXT_PUBLIC_AUTH_USER_ID=11111111-1111-1111-1111-111111111111


NEXT_PUBLIC_API_BASE_URL — base URL for your backend API (required to call /shows, /book, etc.)

NEXT_PUBLIC_AUTH_USER_ID — mock user id used for demo (optional)

Do not commit .env.local or any secret values to git.

Available scripts
npm run dev       # run Next.js in development mode
npm run build     # build for production
npm run start     # start the production build (after build)
npm run lint      # run linter (if configured)
npm run preview   # preview production build locally (next start)

Deployment
Firebase Hosting (preferred for this repo)

This repo includes apphosting.yaml and is scaffolded for Firebase Studio / Hosting.

Install Firebase CLI:

npm install -g firebase-tools


Login and initialize (once):

firebase login
# If you haven't initialized, run:
firebase init hosting
# Choose your Firebase project, set public folder to `.next` or follow Firebase Studio instructions


Build and deploy

npm run build
firebase deploy --only hosting


If your project is created with Firebase Studio, follow the studio deployment steps that generated apphosting.yaml. Make sure to update hosting target and rewrites if using SSR.

Vercel / Netlify alternative

Vercel: import project in Vercel dashboard; set NEXT_PUBLIC_API_BASE_URL in project settings; deploy.

Netlify: build command npm run build and publish directory: .next (or use adapter/SSG). Netlify may require additional configuration for Next.js advanced features (Edge functions / serverless).

Folder structure
eventwave-main/
├─ src/
│  ├─ app/              # Next.js App Router pages/components (page.tsx etc.)
│  ├─ components/       # UI components (SeatGrid, EventCard, AdminForm)
│  ├─ context/          # React Context providers
│  ├─ hooks/            # custom hooks
│  └─ styles/           # global styles and Tailwind config entry points
├─ docs/                # project docs / assets / screenshots
├─ public/              # static assets
├─ package.json
├─ next.config.ts
├─ tailwind.config.ts
├─ apphosting.yaml      # Firebase Studio hosting config
└─ README.md

Connecting to the backend API

This frontend expects a backend API with the following endpoints:

GET ${API_BASE}/shows — list shows (summary)

GET ${API_BASE}/shows/:showId — show seat grid

POST ${API_BASE}/shows/:showId/book — book seats

GET ${API_BASE}/bookings/:bookingId — check booking status

POST ${API_BASE}/admin/shows — create show (admin)

Set NEXT_PUBLIC_API_BASE_URL in .env.local to point to your deployed backend (e.g., https://my-backend.onrender.com/api).

Testing / Concurrency demo tips

To prove concurrency handling (recommended for Modex):

Run two browser windows (or use the concurrency script) and attempt to book the same seat at the same time.

The frontend will receive either PENDING/CONFIRMED for the successful booking and FAILED/409 for others. Show the network tab to reviewers.

You can add a small concurrency-test script in the backend repo which fires parallel booking requests; capture console output and include it in docs/.

Assumptions & Known limitations

This repo is the frontend only — it requires a backend API that supports the endpoints above.

Mock auth: uses a static user id via environment variable (no real login).

Seat layout is either provided by backend or inferred client-side from total_seats.

For real-time updates, integrate a WebSocket or polling mechanism — currently not enabled by default.

How to contribute

Fork the repo and create a feature branch.

Implement feature or fix; add tests where applicable.

Open a PR with a clear title and description.

Keep changes focused and follow existing code style.
