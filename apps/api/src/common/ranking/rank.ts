import { LexoRank } from '@dalet-oss/lexorank';
import { BadRequestError } from '../error/app-error.js';

export type NeighborIds = {
  beforeId: string | null;
  afterId: string | null;
};

export const minRank = (): string => LexoRank.min().toString();

export const middleRank = (): string => LexoRank.middle().toString();

export const maxRank = (): string => LexoRank.max().toString();

export const rankBetween = (left: string, right: string): string => {
  const leftRank = LexoRank.parse(left);
  const rightRank = LexoRank.parse(right);

  if (leftRank.compareTo(rightRank) >= 0) {
    throw new BadRequestError('Invalid rank bounds');
  }

  return leftRank.between(rightRank).toString();
};

export const resolveNeighbors = <T extends { id: string }>(
  items: readonly T[],
  neighbors: NeighborIds,
  currentId?: string,
): { before: T | undefined; after: T | undefined } => {
  const remaining =
    currentId === undefined ? [...items] : items.filter((item) => item.id !== currentId);

  const before =
    neighbors.beforeId === null
      ? undefined
      : remaining.find((item) => item.id === neighbors.beforeId);

  const after =
    neighbors.afterId === null
      ? undefined
      : remaining.find((item) => item.id === neighbors.afterId);

  if (neighbors.beforeId !== null && before === undefined) {
    throw new BadRequestError('beforeId is not in the destination list');
  }

  if (neighbors.afterId !== null && after === undefined) {
    throw new BadRequestError('afterId is not in the destination list');
  }

  if (before !== undefined && after !== undefined) {
    const beforeIndex = remaining.findIndex((item) => item.id === before.id);
    const afterIndex = remaining.findIndex((item) => item.id === after.id);

    if (afterIndex !== beforeIndex + 1) {
      throw new BadRequestError('beforeId and afterId must be immediate neighbors');
    }
  } else if (before === undefined && after === undefined) {
    if (remaining.length > 0) {
      throw new BadRequestError('A non-empty destination requires a neighbor');
    }
  } else if (before === undefined) {
    if (remaining[0]?.id !== after?.id) {
      throw new BadRequestError('afterId must be at the beginning of the destination list');
    }
  } else if (remaining.at(-1)?.id !== before.id) {
    throw new BadRequestError('beforeId must be at the end of the destination list');
  }

  return { before, after };
};
