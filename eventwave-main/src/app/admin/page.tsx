import { CreateEventForm } from '@/components/admin/CreateEventForm';
import { Header } from '@/components/shared/Header';
import ProtectedPage from '@/components/shared/ProtectedPage';

function AdminDashboard() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Create and manage events across the platform.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Event List</h2>
          <div className="p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground bg-card">
            <p>Event list component will go here.</p>
            <p className="text-sm">Functionality to edit and view existing events is planned.</p>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Create New Event</h2>
          <CreateEventForm />
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedPage adminOnly={true}>
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <AdminDashboard />
        </main>
      </div>
    </ProtectedPage>
  );
}
