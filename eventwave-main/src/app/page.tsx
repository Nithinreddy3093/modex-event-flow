'use client';
import { EventList } from '@/components/events/EventList';
import { Header } from '@/components/shared/Header';
import ProtectedPage from '@/components/shared/ProtectedPage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function HomePageContent() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Find Your Next Experience</h1>
        <p className="text-muted-foreground">Discover movies, comedy shows, and concerts tailored for you.</p>
      </div>

      <Tabs defaultValue="all" className="w-full mt-12">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Now Showing</h2>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="SHOW">Movies</TabsTrigger>
            <TabsTrigger value="TRIP">Concerts</TabsTrigger>
            <TabsTrigger value="APPOINTMENT">Comedy</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="all">
          <EventList />
        </TabsContent>
        <TabsContent value="SHOW">
          <EventList filter="SHOW" />
        </TabsContent>
        <TabsContent value="TRIP">
          <EventList filter="TRIP" />
        </TabsContent>
        <TabsContent value="APPOINTMENT">
          <EventList filter="APPOINTMENT" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function Home() {
  return (
    <ProtectedPage>
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <HomePageContent />
        </main>
      </div>
    </ProtectedPage>
  );
}
