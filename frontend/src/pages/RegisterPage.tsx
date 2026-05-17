import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { useRegister } from '@/hooks/useAuth';
import { RegisterForm } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'sales']).default('sales'),
});

const RegisterPage = () => {
  const { mutate: register_, isPending } = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'sales' },
  });

  const fields = [
    { name: 'name' as const, label: 'Full Name', type: 'text', placeholder: 'Your full name', Icon: User },
    { name: 'email' as const, label: 'Email', type: 'email', placeholder: 'you@company.com', Icon: Mail },
    { name: 'password' as const, label: 'Password', type: 'password', placeholder: '••••••••', Icon: Lock },
  ];

  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold text-[var(--color-text)]">Create account</h2>
        <p className="text-sm text-[var(--color-muted)] mt-1.5">Join Smart Leads and manage your pipeline</p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit((d) => register_(d))} className="space-y-4">
          {fields.map(({ name, label, type, placeholder, Icon }) => (
            <div key={name}>
              <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">{label}</label>
              <div className="relative">
                <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input
                  {...register(name)}
                  type={type}
                  placeholder={placeholder}
                  className="input-base pl-9"
                />
              </div>
              {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]?.message}</p>}
            </div>
          ))}

          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">Role</label>
            <select {...register('role')} className="input-base">
              <option value="sales">Sales User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" disabled={isPending} className="btn-primary w-full mt-2">
            {isPending ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-[var(--color-muted)] mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
