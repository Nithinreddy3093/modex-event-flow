# **App Name**: EventWave

## Core Features:

- User Authentication: Secure user registration, login, and role-based access control (User/Admin) using JWT. Implements signup, login, refresh, and logout functionality.
- Admin Event Management: Create, read, update, and delete events (SHOW, TRIP, APPOINTMENT) with seat maps or slots. Admins can define event details, seat availability, and slot configurations.
- Event Listing and Filtering: Display a list of available events with filtering options (type, time). Users can view event details, availability, and book tickets/appointments.
- Availability Snapshot: Provides real-time availability of seats or slots for each event. Displays seat status (AVAILABLE, HELD, BOOKED) or slot availability with remaining capacity.
- Concurrency-Safe Booking: Ensures concurrent booking requests are handled safely using database transactions and row locking (SELECT … FOR UPDATE) to prevent overbooking.
- Booking Management: Manages booking creation, confirmation, and cancellation with status tracking (PENDING, CONFIRMED, FAILED). Includes automatic expiry for pending bookings and releasing held resources.
- AI-Powered Recommendations: Generates personalized event recommendations for users using collaborative filtering.  This tool analyzes user preferences and booking history to suggest relevant events.

## Style Guidelines:

- Primary color: Deep indigo (#3F51B5) for a sense of trust and sophistication, reflecting the reliable nature of the ticketing system.
- Background color: Light gray (#ECEFF1), subtly desaturated from the primary, providing a clean and neutral backdrop for content.
- Accent color: Warm amber (#FFB300), analogous to indigo, adding vibrancy to calls to action and important highlights.
- Headline font: 'Poppins' sans-serif, for headlines. Its modern and geometric qualities make it precise and readable.
- Body font: 'PT Sans' sans-serif, for body text. It complements Poppins with a humanist touch, providing warmth and excellent readability for longer text blocks.
- Use clear and intuitive icons representing event types (movie reel, bus, calendar) and actions (booking, seat selection). Icons should be consistent in style, using filled or outlined designs.
- Maintain a clean, grid-based layout with clear visual hierarchy. Prioritize content with sufficient whitespace to avoid clutter and ensure easy navigation.
- Use subtle transitions and animations for actions like seat selection, booking confirmation, and error messages. Animations should enhance user experience without being distracting.