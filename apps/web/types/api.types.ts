import { z } from 'zod';

export enum Frequency {
  DAILY = 'daily',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

const frequencySchema = z
  .enum([
    Frequency.DAILY,
    Frequency.MONTHLY,
    Frequency.QUARTERLY,
    Frequency.YEARLY,
  ])
  .optional();

export const querySchema = z.object({
  year: z
    .string()
    .regex(/^\d{4}$/, 'invalid year')
    .optional()
    .transform(Number),
  frequency: frequencySchema.optional().default(Frequency.MONTHLY),
});

export type querySchemaT = z.infer<typeof querySchema>;
