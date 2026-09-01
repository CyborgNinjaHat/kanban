import { z } from 'zod';

export const cardDescriptionSchema = z.string().trim().min(1).max(255);

export type CardDescription = z.infer<typeof cardDescriptionSchema>;
