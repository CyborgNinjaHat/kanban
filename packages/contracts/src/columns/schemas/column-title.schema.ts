import { z } from 'zod';

export const columnTitleSchema = z.string().trim().min(1).max(60);

export type ColumnTitle = z.infer<typeof columnTitleSchema>;
