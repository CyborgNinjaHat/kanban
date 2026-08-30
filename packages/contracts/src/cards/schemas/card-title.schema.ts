import { z } from 'zod';

export const cardTitleSchema = z.string().trim().min(1).max(60);

export type CardTitle = z.infer<typeof cardTitleSchema>;
