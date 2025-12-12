EventWave – Frontend

EventWave is a Next.js + TypeScript frontend for a ticket-booking platform.
Users can browse events, view seat layouts, and book seats. Admins can create new shows/trips.
This project is designed to connect with a backend API built using Node.js + Express + PostgreSQL.

🚀 Live Demo

https://eventwave-one.vercel.app/

📌 Features

List all shows/trips

View detailed seat layout

Select and book seats

Booking status: PENDING / CONFIRMED / FAILED

Admin panel to create shows

Error handling & clean UI (TailwindCSS)

📦 Tech Stack

Next.js (App Router)

TypeScript

React + Context API

TailwindCSS

Firebase Hosting (config included)

🛠️ Setup (Local)
git clone https://github.com/Nithinreddy3093/modex-event-flow.git
cd modex-event-flow/eventwave-main
npm install


Create .env.local:

NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api


Start dev server:

npm run dev

🌐 Deployment
Firebase Hosting
npm run build
firebase deploy --only hosting

Vercel / Netlify

Update NEXT_PUBLIC_API_BASE_URL, then deploy normally.

📁 Project Structure
src/
  app/          # Pages & routes
  components/   # UI components
  context/      # Global state
docs/           # Screenshots/docs

🔗 Backend Integration

The frontend expects these API endpoints:

GET /shows

GET /shows/:id

POST /shows/:id/book

GET /bookings/:id

POST /admin/shows

Set the backend URL in NEXT_PUBLIC_API_BASE_URL.

📌 Known Limitations

Mock user authentication

Real-time seat updates optional (not enabled by default)
