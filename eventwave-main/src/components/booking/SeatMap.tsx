'use client';

import { useState } from 'react';
import type { Event, ShowAvailability, Booking } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

type SeatMapProps = {
  event: Event;
  availability: ShowAvailability;
};

const USER_BOOKINGS_STORAGE_KEY = 'gtp_user_bookings';

export function SeatMap({ event, availability }: SeatMapProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const toggleSeat = (seatNumber: string) => {
    setSelectedSeats(prev =>
      prev.includes(seatNumber) ? prev.filter(s => s !== seatNumber) : [...prev, seatNumber]
    );
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No seats selected',
        description: 'Please select at least one seat to book.',
      });
      return;
    }
    setIsLoading(true);
    try {
      // Mocking API call
      await new Promise(res => setTimeout(res, 1500));
      const success = Math.random() > 0.2; // 80% success rate
      if (!success) {
          throw new Error("One or more selected seats are no longer available.");
      }
      const response: Booking = {
        bookingId: `bk-${Date.now()}`,
        status: 'CONFIRMED'
      };
      
      const newBooking = {
        id: response.bookingId,
        eventName: event.name,
        eventDate: event.startTime,
        bookingStatus: 'CONFIRMED' as const,
        seats: selectedSeats.join(', '),
        slotTime: null,
      };

      const existingBookings = JSON.parse(localStorage.getItem(USER_BOOKINGS_STORAGE_KEY) || '[]');
      localStorage.setItem(USER_BOOKINGS_STORAGE_KEY, JSON.stringify([newBooking, ...existingBookings]));

      toast({
        title: `Booking ${response.status}`,
        description: `Your booking ID is ${response.bookingId}. Status: ${response.status}`,
      });
      setSelectedSeats([]);

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: error.message || 'Could not complete your booking.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const DUMMY_PRICE = event.type === 'SHOW' ? 25 : 45;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Select Your Seats</CardTitle>
          <div className="text-center bg-muted text-muted-foreground py-2 my-4 rounded-md tracking-widest font-semibold">SCREEN</div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 justify-center p-6">
          {availability.seats.map(seat => (
            <Button
              key={seat.seatNumber}
              variant={
                seat.status !== 'AVAILABLE' ? 'secondary' :
                selectedSeats.includes(seat.seatNumber) ? 'default' : 'outline'
              }
              className={cn('w-12 h-12 font-bold', {
                'cursor-not-allowed opacity-50': seat.status !== 'AVAILABLE',
                'bg-accent text-accent-foreground hover:bg-accent/90': selectedSeats.includes(seat.seatNumber),
              })}
              onClick={() => seat.status === 'AVAILABLE' && toggleSeat(seat.seatNumber)}
              disabled={seat.status !== 'AVAILABLE'}
              aria-label={`Seat ${seat.seatNumber}, ${seat.status}`}
            >
              {seat.seatNumber}
            </Button>
          ))}
        </CardContent>
        <CardFooter className="flex justify-center space-x-6 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm"><div className="w-4 h-4 rounded-sm border-2 bg-background"/> Available</div>
          <div className="flex items-center gap-2 text-sm"><div className="w-4 h-4 rounded-sm bg-accent"/> Selected</div>
          <div className="flex items-center gap-2 text-sm"><div className="w-4 h-4 rounded-sm bg-secondary"/> Unavailable</div>
        </CardFooter>
      </Card>

      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle>Your Selection</CardTitle>
          <CardDescription>Review your choices before booking.</CardDescription>
        </CardHeader>
        <CardContent>
          {selectedSeats.length > 0 ? (
            <div className="space-y-4">
                <div className="font-semibold">Seats: {selectedSeats.join(', ')}</div>
                <div className="text-2xl font-bold">Total: ${ (selectedSeats.length * DUMMY_PRICE).toFixed(2) }</div>
                <p className="text-xs text-muted-foreground">Price per ticket: ${DUMMY_PRICE.toFixed(2)}</p>
            </div>
          ) : (
            <p className="text-muted-foreground italic">Click on available seats to add them to your booking.</p>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleBooking} disabled={isLoading || selectedSeats.length === 0}>
            {isLoading ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
