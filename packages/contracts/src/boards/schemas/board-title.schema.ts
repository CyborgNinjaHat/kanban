import { z } from 'zod';

export const boardTitleSchema = z.string().trim().min(1).max(60);

export type BoardTitle = z.infer<typeof boardTitleSchema>;
