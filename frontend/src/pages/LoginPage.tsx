import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useLogin } from '@/hooks/useAuth';
import { LoginForm } from '@/types';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

const LoginPage = () => {
  const { mutate: login, isPending } = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold text-[var(--color-text)]">Welcome back</h2>
        <p className="text-sm text-[var(--color-muted)] mt-1.5">Sign in to your Smart Leads account</p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit((d) => login(d))} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                {...register('email')}
                type="email"
                placeholder="you@company.com"
                className="input-base pl-9"
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="input-base pl-9"
                autoComplete="current-password"
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={isPending} className="btn-primary w-full mt-2">
            {isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-[var(--color-muted)] mt-4">
        Don't have an account?{' '}
        <Link to="/register" className="text-brand-600 hover:text-brand-700 font-medium">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
