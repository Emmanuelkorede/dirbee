'use client';

import { useActionState } from 'react';

import { BrandLockup } from '@/components/brand/brand-lockup';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';
import { FormField } from '@/components/ui/form-field';
import { FormMessage } from '@/components/ui/form-message';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/ui/submit-button';
import { signInWithEmail } from './action';

export default function SignInPage() {
  const [state, formAction] = useActionState(signInWithEmail, null);

  return (
    <main className="grid min-h-dvh place-items-center px-6 py-16">
      <div className="fixed right-6 top-6">
        <ThemeSwitcher />
      </div>

      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <BrandLockup orientation="vertical" />
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Admin sign in
          </p>
        </div>

        <form action={formAction} className="space-y-5">
          <FormField label="Email address" name="email">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@houseofbee.site"
            />
          </FormField>

          <FormField label="Password" name="password">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </FormField>

          <FormMessage result={state ? { success: false, error: state.error } : null} />

          <SubmitButton pendingText="Signing in..." className="w-full">
            Sign in
          </SubmitButton>
        </form>
      </div>
    </main>
  );
}