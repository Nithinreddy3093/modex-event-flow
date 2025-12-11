'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

type ProtectedPageProps = {
  children: React.ReactNode;
  adminOnly?: boolean;
};

export default function ProtectedPage({ children, adminOnly = false }: ProtectedPageProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(adminOnly ? '/admin/login' : '/auth/login');
      } else if (adminOnly && user?.role !== 'ADMIN') {
        router.push('/'); // Or a dedicated 'unauthorized' page
      }
    }
  }, [isAuthenticated, isLoading, router, adminOnly, user]);

  if (isLoading || !isAuthenticated || (adminOnly && user?.role !== 'ADMIN')) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center">
            <Skeleton className="h-8 w-32" />
            <div className="flex flex-1 items-center justify-end space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </header>
        <main className="flex-1 container py-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
      </div>
    );
  }

  return <>{children}</>;
}
