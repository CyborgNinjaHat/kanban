import { zValidator } from '@hono/zod-validator';
import { ValidationError } from '../common/error/app-error.js';

import type { ValidationTargets } from 'hono';
import type * as z from 'zod';

export const zodValidator = <T extends z.ZodType, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T,
) =>
  zValidator(target, schema, (result, _context) => {
    if (!result.success) {
      const details: Record<string, string[]> = {};

      for (const issue of result.error.issues) {
        const path = issue.path.join('.');
        details[path] ??= [];
        details[path].push(issue.message);
      }

      throw new ValidationError('Validation failed', details);
    }
  });
