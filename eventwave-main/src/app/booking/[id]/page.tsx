'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Event, ShowAvailability, AppointmentAvailability } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ServerCrash } from 'lucide-react';
import { SeatMap } from '@/components/booking/SeatMap';
import { SlotSelector } from '@/components/booking/SlotSelector';
import ProtectedPage from '@/components/shared/ProtectedPage';
import { Header } from '@/components/shared/Header';

const mockEvents: Event[] = [
    { id: 'evt-1', type: 'SHOW', name: 'Dune: Part Two', startTime: new Date(Date.now() + 86400000 * 1).toISOString(), totalSeats: 150, createdAt: new Date().toISOString() },
    { id: 'evt-4', type: 'SHOW', name: 'Oppenheimer', startTime: new Date(Date.now() + 86400000 * 2).toISOString(), totalSeats: 180, createdAt: new Date().toISOString() },
    { id: 'evt-2', type: 'TRIP', name: 'Coldplay: Music of the Spheres', startTime: new Date(Date.now() + 86400000 * 5).toISOString(), totalSeats: 5000, createdAt: new Date().toISOString() },
    { id: 'evt-5', type: 'TRIP', name: 'Ed Sheeran: +–=÷× Tour', startTime: new Date(Date.now() + 86400000 * 12).toISOString(), totalSeats: 4500, createdAt: new Date().toISOString() },
    { id: 'evt-3', type: 'APPOINTMENT', name: 'Zakir Khan Live', startTime: new Date(Date.now() + 86400000 * 7).toISOString(), totalSeats: null, createdAt: new Date().toISOString() },
    { id: 'evt-6', type: 'APPOINTMENT', name: 'Anubhav Singh Bassi: Bas Kar Bassi', startTime: new Date(Date.now() + 86400000 * 10).toISOString(), totalSeats: null, createdAt: new Date().toISOString() },
];

function generateMockAvailability(event: Event): ShowAvailability | AppointmentAvailability {
    if (event.type === 'SHOW' || event.type === 'TRIP') {
        const prefixes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        const seatsPerPrefix = Math.ceil(event.totalSeats / prefixes.length);
        const seats = Array.from({ length: event.totalSeats }).map((_, i) => {
            const prefix = prefixes[Math.floor(i / seatsPerPrefix)];
            const number = (i % seatsPerPrefix) + 1;
            const status = Math.random() > 0.7 ? 'BOOKED' : 'AVAILABLE';
            return { seatNumber: `${prefix}${number}`, status: status as 'BOOKED' | 'AVAILABLE' };
        });
        return { seats };
    } else {
        const slots = Array.from({ length: 5 }).map((_, i) => ({
            slotId: `slot-${event.id}-${i}`,
            slotTime: new Date(new Date(event.startTime).setHours(18 + i, 0, 0, 0)).toISOString(),
            remaining: Math.random() > 0.5 ? 1 : 0
        }));
        return { slots };
    }
}

function BookingPageContent() {
  const params = useParams();
  const eventId = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [availability, setAvailability] = useState<ShowAvailability | AppointmentAvailability | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 500));
        const currentEvent = mockEvents.find(e => e.id === eventId);
        if (!currentEvent) throw new Error('Event not found');
        setEvent(currentEvent);
        setAvailability(generateMockAvailability(currentEvent));
      } catch (err: any) {
        setError(err.message || 'Failed to load booking information.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [eventId]);

  const renderBookingInterface = () => {
    if (!event || !availability) return null;
    switch (event.type) {
      case 'SHOW':
      case 'TRIP':
        return <SeatMap event={event} availability={availability as ShowAvailability} />;
      case 'APPOINTMENT':
        return <SlotSelector event={event} availability={availability as AppointmentAvailability} />;
      default:
        return <p>Unsupported event type.</p>;
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-12 w-1/2 mb-4" />
        <Skeleton className="h-8 w-1/3 mb-8" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <ServerCrash className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{event?.name}</h1>
        <p className="text-muted-foreground">{event && new Date(event.startTime).toLocaleString()}</p>
      </div>
      {renderBookingInterface()}
    </div>
  );
}

export default function BookingPage() {
    return (
        <ProtectedPage>
            <div className="relative flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">
                    <BookingPageContent />
                </main>
            </div>
        </ProtectedPage>
    );
}
