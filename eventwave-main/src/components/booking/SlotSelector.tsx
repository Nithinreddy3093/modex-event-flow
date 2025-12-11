'use client';
import { useState } from 'react';
import type { Event, AppointmentAvailability, Booking } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type SlotSelectorProps = {
  event: Event;
  availability: AppointmentAvailability;
};

const USER_BOOKINGS_STORAGE_KEY = 'gtp_user_bookings';

export function SlotSelector({ event, availability }: SlotSelectorProps) {
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleBooking = async () => {
    if (!selectedSlotId) {
      toast({
        variant: 'destructive',
        title: 'No slot selected',
        description: 'Please select a time slot to book.',
      });
      return;
    }
    setIsLoading(true);
    try {
      await new Promise(res => setTimeout(res, 1500));
      const success = Math.random() > 0.2;
      if (!success) {
          throw new Error("This slot is no longer available.");
      }
      
      const response: Booking = {
        bookingId: `bk-apt-${Date.now()}`,
        status: 'CONFIRMED'
      };

      const selectedSlot = availability.slots.find(s => s.slotId === selectedSlotId)!;

      const newBooking = {
        id: response.bookingId,
        eventName: event.name,
        eventDate: event.startTime,
        bookingStatus: 'CONFIRMED' as const,
        seats: null,
        slotTime: selectedSlot.slotTime,
      };

      const existingBookings = JSON.parse(localStorage.getItem(USER_BOOKINGS_STORAGE_KEY) || '[]');
      localStorage.setItem(USER_BOOKINGS_STORAGE_KEY, JSON.stringify([newBooking, ...existingBookings]));

      toast({
        title: `Booking ${response.status}`,
        description: `Your appointment for ${format(new Date(selectedSlot.slotTime), 'p')} is ${response.status}.`,
      });

      setSelectedSlotId(null);

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: error.message || 'Could not book the slot. It may have just been taken.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const selectedSlotTime = selectedSlotId ? availability.slots.find(s => s.slotId === selectedSlotId)?.slotTime : null;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Select a Time Slot</CardTitle>
        <CardDescription>Appointments are one-on-one. Available slots are shown below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {availability.slots.map(slot => (
            <Button
              key={slot.slotId}
              variant={selectedSlotId === slot.slotId ? 'default' : 'outline'}
              disabled={slot.remaining <= 0}
              onClick={() => setSelectedSlotId(slot.slotId)}
              className={cn("h-12 text-base", { "bg-accent text-accent-foreground hover:bg-accent/90": selectedSlotId === slot.slotId })}
              aria-pressed={selectedSlotId === slot.slotId}
            >
              {format(new Date(slot.slotTime), 'p')}
            </Button>
          ))}
           {availability.slots.length === 0 && <p className="text-muted-foreground col-span-full text-center">No available slots.</p>}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch space-y-4 border-t pt-6">
         {selectedSlotTime && (
            <div className="text-center p-3 bg-muted rounded-md">
                You have selected the <span className="font-bold text-primary">{format(new Date(selectedSlotTime), 'p')}</span> slot.
            </div>
         )}
        <Button size="lg" onClick={handleBooking} disabled={isLoading || !selectedSlotId}>
          {isLoading ? 'Booking...' : 'Confirm Appointment'}
        </Button>
      </CardFooter>
    </Card>
  );
}
