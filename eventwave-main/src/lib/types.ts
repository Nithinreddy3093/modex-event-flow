export type User = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
};

export type AuthPayload = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type EventType = 'SHOW' | 'TRIP' | 'APPOINTMENT';

export interface BaseEvent {
  id: string;
  type: EventType;
  name: string;
  startTime: string; // ISO string
  createdAt: string; // ISO string
}

export interface ShowEvent extends BaseEvent {
  type: 'SHOW';
  totalSeats: number;
}

export interface TripEvent extends BaseEvent {
  type: 'TRIP';
  totalSeats: number;
}

export interface AppointmentEvent extends BaseEvent {
  type: 'APPOINTMENT';
  totalSeats: null;
}

export type Event = ShowEvent | TripEvent | AppointmentEvent;

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'FAILED';

export type Booking = {
  bookingId: string;
  status: BookingStatus;
  expiresAt?: string; // ISO string
};

export type Seat = {
  seatNumber: string;
  status: 'AVAILABLE' | 'HELD' | 'BOOKED';
};

export type ShowAvailability = {
  seats: Seat[];
};

export type Slot = {
  slotId: string;
  slotTime: string; // ISO string
  remaining: number;
};

export type AppointmentAvailability = {
  slots: Slot[];
};
