'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ServerCrash, Ticket } from 'lucide-react';
import { format } from 'date-fns';

type Booking = {
  id: string;
  eventName: string;
  eventDate: string;
  bookingStatus: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  seats: string | null;
  slotTime: string | null;
};

const USER_BOOKINGS_STORAGE_KEY = 'gtp_user_bookings';

const mockBookings: Booking[] = [
  { id: 'bk-1', eventName: 'Dune: Part Two', eventDate: new Date(Date.now() + 86400000 * 1).toISOString(), bookingStatus: 'CONFIRMED', seats: 'D5, D6', slotTime: null },
  { id: 'bk-2', eventName: 'Zakir Khan Live', eventDate: new Date(Date.now() + 86400000 * 7).toISOString(), bookingStatus: 'CONFIRMED', seats: null, slotTime: new Date(new Date().setHours(19, 0, 0, 0)).toISOString() },
  { id: 'bk-3', eventName: 'Coldplay: Music of the Spheres', eventDate: new Date(Date.now() + 86400000 * 5).toISOString(), bookingStatus: 'PENDING', seats: 'GA-101, GA-102', slotTime: null },
  { id: 'bk-4', eventName: 'Oppenheimer', eventDate: new Date(Date.now() - 86400000 * 20).toISOString(), bookingStatus: 'CONFIRMED', seats: 'A1, A2', slotTime: null },
];

export function UserBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        setIsLoading(true);
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const storedBookings = localStorage.getItem(USER_BOOKINGS_STORAGE_KEY);
        if (storedBookings) {
          setBookings(JSON.parse(storedBookings));
        } else {
          // Set initial mock data if nothing is in storage
          setBookings(mockBookings);
          localStorage.setItem(USER_BOOKINGS_STORAGE_KEY, JSON.stringify(mockBookings));
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch bookings.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const getStatusVariant = (status: Booking['bookingStatus']) => {
    switch (status) {
      case 'CONFIRMED':
        return 'default';
      case 'PENDING':
        return 'secondary';
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <ServerCrash className="h-4 w-4" />
        <AlertTitle>Error Loading Bookings</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Bookings</CardTitle>
        <CardDescription>A list of your recent event bookings.</CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map(booking => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.eventName}</TableCell>
                  <TableCell className="text-muted-foreground">{booking.seats || (booking.slotTime && format(new Date(booking.slotTime), 'p'))}</TableCell>
                  <TableCell>{format(new Date(booking.eventDate), 'PPP')}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getStatusVariant(booking.bookingStatus)}>{booking.bookingStatus}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <Ticket className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-lg font-semibold">No Bookings Yet</h3>
            <p className="text-sm">You haven't booked any events. Go find an experience!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
