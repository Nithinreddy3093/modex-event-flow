'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Calendar as CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const formSchema = z.object({
  type: z.enum(['SHOW', 'TRIP', 'APPOINTMENT']),
  name: z.string().min(3, 'Name is too short'),
  startTime: z.date({ required_error: 'Start date is required.' }),
  totalSeats: z.coerce.number().int().positive().optional(),
  seatMap: z.string().optional(),
  slots: z
    .array(
      z.object({
        slotTime: z.string({ required_error: 'Slot time is required.' }),
        capacity: z.coerce.number().int().positive().default(1),
      })
    )
    .optional(),
});

export function CreateEventForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'SHOW',
      name: '',
      slots: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'slots',
  });

  const eventType = form.watch('type');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const apiPayload: any = {
      ...values,
      startTime: values.startTime.toISOString(),
    };

    if (eventType === 'APPOINTMENT') {
        apiPayload.slots = values.slots?.map(slot => ({
            ...slot,
            slotTime: new Date(`${format(values.startTime, 'yyyy-MM-dd')}T${slot.slotTime}`).toISOString()
        }));
        delete apiPayload.totalSeats;
        delete apiPayload.seatMap;
    } else {
        apiPayload.seatMap = values.seatMap?.split(',').flatMap(range => {
            const [start, end] = range.trim().split('-');
            const prefix = start.match(/[A-Z]+/)?.[0];
            if (!prefix) return [];
            const startNum = parseInt(start.substring(prefix.length));
            const endNum = parseInt(end.substring(prefix.length));
            return Array.from({ length: endNum - startNum + 1 }, (_, i) => `${prefix}${startNum + i}`);
        });
        delete apiPayload.slots;
    }

    try {
      console.log("Creating event with payload:", apiPayload);
      // await api.post('/admin/events', apiPayload);
      await new Promise(res => setTimeout(res, 1000));
      toast({
        title: 'Event Created',
        description: `Successfully created "${values.name}".`,
      });
      form.reset();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Creation Failed',
        description: error.error?.message || 'Could not create the event.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="type" render={({ field }) => (
              <FormItem>
                <FormLabel>Event Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select an event type" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="SHOW">Show</SelectItem>
                    <SelectItem value="TRIP">Trip</SelectItem>
                    <SelectItem value="APPOINTMENT">Appointment</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Event Name</FormLabel><FormControl><Input placeholder="e.g., Summer Music Festival" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name="startTime" render={({ field }) => (
              <FormItem className="flex flex-col"><FormLabel>Event Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild><FormControl>
                      <Button variant="outline" className={cn('w-full pl-3 text-left font-normal',!field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                  </FormControl></PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus />
                  </PopoverContent>
                </Popover><FormMessage />
              </FormItem>
            )} />
            
            {(eventType === 'SHOW' || eventType === 'TRIP') && (
              <>
                <FormField control={form.control} name="totalSeats" render={({ field }) => (
                  <FormItem><FormLabel>Total Seats</FormLabel><FormControl><Input type="number" placeholder="40" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="seatMap" render={({ field }) => (
                  <FormItem><FormLabel>Seat Map</FormLabel><FormControl><Input placeholder="e.g. A1-A8, B1-B8" {...field} /></FormControl><FormDescription>Comma-separated ranges.</FormDescription><FormMessage /></FormItem>
                )} />
              </>
            )}

            {eventType === 'APPOINTMENT' && (
              <div className="space-y-4">
                <FormLabel>Slots</FormLabel>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-2 p-3 border rounded-lg">
                    <FormField control={form.control} name={`slots.${index}.slotTime`} render={({ field }) => (
                      <FormItem className="flex-grow"><FormLabel className="text-xs">Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`slots.${index}.capacity`} render={({ field }) => (
                      <FormItem><FormLabel className="text-xs">Capacity</FormLabel><FormControl><Input type="number" className="w-20" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => append({ slotTime: '09:00', capacity: 1 })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Slot
                </Button>
              </div>
            )}

            <Button type="submit" className="w-full !mt-8" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create Event'}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
