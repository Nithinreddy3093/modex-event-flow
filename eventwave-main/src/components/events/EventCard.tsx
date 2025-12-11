import type { Event } from '@/lib/types';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Film, Music, Mic, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';

const eventIcons: Record<Event['type'], React.ReactNode> = {
  SHOW: <Film className="w-4 h-4" />,
  TRIP: <Music className="w-4 h-4" />,
  APPOINTMENT: <Mic className="w-4 h-4" />,
};

const getPlaceholderImage = (eventId: string): ImagePlaceholder => {
  const imageId = (parseInt(eventId.replace(/[^0-9]/g, '') || '0') % PlaceHolderImages.length);
  return PlaceHolderImages[imageId] || PlaceHolderImages[0];
};

export function EventCard({ event }: { event: Event }) {
  const placeholder = getPlaceholderImage(event.id);
  
  const getEventTypeLabel = (type: Event['type']) => {
    switch (type) {
      case 'SHOW': return 'Movie';
      case 'TRIP': return 'Concert';
      case 'APPOINTMENT': return 'Comedy';
      default: return event.type;
    }
  }

  return (
    <Card className="flex flex-col overflow-hidden h-full transform transition-transform duration-300 ease-in-out hover:-translate-y-1.5 hover:shadow-xl dark:hover:shadow-primary/20">
      <CardHeader className="p-0 relative">
        <Link href={`/booking/${event.id}`}>
          <Image
            src={placeholder.imageUrl}
            alt={event.name}
            width={600}
            height={400}
            className="w-full h-48 object-cover"
            data-ai-hint={placeholder.imageHint}
          />
        </Link>
        <Badge
          variant="default"
          className="absolute top-3 right-3 flex items-center gap-1.5 shadow-lg"
        >
          {eventIcons[event.type]}
          <span className="font-semibold">{getEventTypeLabel(event.type)}</span>
        </Badge>
      </CardHeader>
      <CardContent className="p-4 flex flex-col flex-grow">
        <CardTitle className="text-lg mb-2 truncate">{event.name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Clock className="w-4 h-4 mr-2" />
          <span>{new Date(event.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
        </div>
        
        <div className="mt-auto pt-4">
          <Button asChild className="w-full">
            <Link href={`/booking/${event.id}`}>
              {event.type === 'APPOINTMENT' ? 'Book Tickets' : 'Book Seats'}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
