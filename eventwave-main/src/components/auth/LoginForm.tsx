'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import type { AuthPayload } from '@/lib/types';
import { useState } from 'react';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormProps = {
  adminLogin?: boolean;
};

export function LoginForm({ adminLogin = false }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Mocking API response for demonstration
      const isCorrect = values.email === (adminLogin ? 'admin@growtoprove.com' : 'user@test.com') && values.password === (adminLogin ? 'Admin@123' : 'User@123');
      
      if (!isCorrect) {
          throw new Error("Invalid credentials");
      }
      
      const payload: AuthPayload = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
            id: adminLogin ? 'admin-1' : 'user-1',
            name: adminLogin ? 'Admin User' : 'Test User',
            email: values.email,
            role: adminLogin ? 'ADMIN' : 'USER'
        }
      }

      if (adminLogin && payload.user.role !== 'ADMIN') {
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: 'You do not have administrative privileges.',
        });
        return;
      }

      login(payload);

      toast({
        title: 'Login Successful',
        description: `Welcome back, ${payload.user.name}!`,
      });

      router.replace(adminLogin ? '/admin' : '/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid credentials. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder={adminLogin ? 'admin@growtoprove.com' : 'user@test.com'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder={adminLogin ? 'Admin@123' : 'User@123'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
    </Form>
  );
}
