'use client';
import { useEffect, useState, useMemo } from 'react';
import { api } from '@/lib/api';
import type { Event, EventType } from '@/lib/types';
import { EventCard } from './EventCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ServerCrash } from 'lucide-react';

type EventListProps = {
  filter?: EventType | 'all';
};

const mockEvents: Event[] = [
    { id: 'evt-1', type: 'SHOW', name: 'Dune: Part Two', startTime: new Date(Date.now() + 86400000 * 1).toISOString(), totalSeats: 150, createdAt: new Date().toISOString() },
    { id: 'evt-4', type: 'SHOW', name: 'Oppenheimer', startTime: new Date(Date.now() + 86400000 * 2).toISOString(), totalSeats: 180, createdAt: new Date().toISOString() },
    { id: 'evt-2', type: 'TRIP', name: 'Coldplay: Music of the Spheres', startTime: new Date(Date.now() + 86400000 * 5).toISOString(), totalSeats: 5000, createdAt: new Date().toISOString() },
    { id: 'evt-5', type: 'TRIP', name: 'Ed Sheeran: +–=÷× Tour', startTime: new Date(Date.now() + 86400000 * 12).toISOString(), totalSeats: 4500, createdAt: new Date().toISOString() },
    { id: 'evt-3', type: 'APPOINTMENT', name: 'Zakir Khan Live', startTime: new Date(Date.now() + 86400000 * 7).toISOString(), totalSeats: null, createdAt: new Date().toISOString() },
    { id: 'evt-6', type: 'APPOINTMENT', name: 'Anubhav Singh Bassi: Bas Kar Bassi', startTime: new Date(Date.now() + 86400000 * 10).toISOString(), totalSeats: null, createdAt: new Date().toISOString() },
];


export function EventList({ filter = 'all' }: EventListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true);
        setError(null);
        // Mocking API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEvents(mockEvents);
        // const fetchedEvents = await api.get<Event[]>('/events');
        // setEvents(fetchedEvents);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch events.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    if (filter === 'all') return events;
    return events.filter(event => event.type === filter);
  }, [events, filter]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
             <Skeleton className="h-[225px] w-full rounded-xl" />
             <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
             </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <ServerCrash className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (filteredEvents.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No events of this type found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredEvents.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
