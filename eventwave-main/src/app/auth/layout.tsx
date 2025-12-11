export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex items-center justify-center min-h-screen w-full p-4">
      {children}
    </main>
  );
}
