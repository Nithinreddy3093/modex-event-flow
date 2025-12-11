'use client';

import { Header } from '@/components/shared/Header';
import ProtectedPage from '@/components/shared/ProtectedPage';
import { UserBookings } from '@/components/dashboard/UserBookings';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

function DashboardContent() {
    const { user } = useAuth();

    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1) {
          return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
      };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Dashboard</h1>
        <p className="text-muted-foreground">Review your bookings and manage your account.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-14 w-14">
                        <AvatarFallback className="text-2xl">{user && getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-xl">{user?.name}</CardTitle>
                        <CardDescription>{user?.email}</CardDescription>
                    </div>
                </CardHeader>
            </Card>
        </div>
        <div className="lg:col-span-2">
          <UserBookings />
        </div>
      </div>
    </div>
  );
}


export default function DashboardPage() {
    return (
      <ProtectedPage>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <DashboardContent />
          </main>
        </div>
      </ProtectedPage>
    );
  }
  