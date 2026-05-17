import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lead, LeadForm as LeadFormType } from '@/types';
import { LEAD_STATUSES, LEAD_SOURCES } from '@/constants';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
  notes: z.string().max(500).optional(),
});

interface LeadFormProps {
  defaultValues?: Partial<Lead>;
  onSubmit: (data: LeadFormType) => void;
  isLoading?: boolean;
  onCancel: () => void;
  submitLabel?: string;
}

export const LeadForm = ({
  defaultValues,
  onSubmit,
  isLoading,
  onCancel,
  submitLabel = 'Save Lead',
}: LeadFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      email: defaultValues?.email ?? '',
      status: defaultValues?.status ?? 'New',
      source: defaultValues?.source ?? 'Website',
      notes: defaultValues?.notes ?? '',
    },
  });

  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Full Name" error={errors.name?.message}>
          <input {...register('name')} placeholder="Rahul Sharma" className="input-base" />
        </Field>
        <Field label="Email Address" error={errors.email?.message}>
          <input {...register('email')} type="email" placeholder="rahul@example.com" className="input-base" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Status" error={errors.status?.message}>
          <select {...register('status')} className="input-base">
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Source" error={errors.source?.message}>
          <select {...register('source')} className="input-base">
            {LEAD_SOURCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Notes (optional)" error={errors.notes?.message}>
        <textarea
          {...register('notes')}
          rows={3}
          placeholder="Any additional context about this lead…"
          className="input-base resize-none"
        />
      </Field>

      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="btn-primary flex-1">
          {isLoading ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
};
