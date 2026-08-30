import {
  columnBoardParamsSchema,
  columnParamsSchema,
  createColumnBodySchema,
  deleteColumnParamsSchema,
  reorderColumnBodySchema,
  updateColumnBodySchema,
} from '@kanban/contracts';
import { createHandlers } from '../../common/core/hono-factory.js';
import { zodValidator } from '../../middlewares/zod-validator-middleware.js';
import { columnService } from './column.service.js';

import type { ColumnService } from './column.service.js';

export class ColumnController {
  private readonly service: ColumnService;

  constructor(service: ColumnService = columnService) {
    this.service = service;
  }

  getAll = createHandlers(zodValidator('param', columnBoardParamsSchema), async (context) => {
    const { boardId } = context.req.valid('param');
    const columns = await this.service.getAllColumns(boardId);
    return context.json(columns, 200);
  });

  create = createHandlers(
    zodValidator('param', columnBoardParamsSchema),
    zodValidator('json', createColumnBodySchema),
    async (context) => {
      const { boardId } = context.req.valid('param');
      const data = context.req.valid('json');
      const column = await this.service.createColumn(boardId, data);
      return context.json(column, 201);
    },
  );

  getById = createHandlers(zodValidator('param', columnParamsSchema), async (context) => {
    const { boardId, columnId } = context.req.valid('param');
    const column = await this.service.getColumnById(boardId, columnId);
    return context.json(column, 200);
  });

  update = createHandlers(
    zodValidator('param', columnParamsSchema),
    zodValidator('json', updateColumnBodySchema),
    async (context) => {
      const { boardId, columnId } = context.req.valid('param');
      const data = context.req.valid('json');
      const column = await this.service.updateColumn(boardId, columnId, data);
      return context.json(column, 200);
    },
  );

  reorder = createHandlers(
    zodValidator('param', columnParamsSchema),
    zodValidator('json', reorderColumnBodySchema),
    async (context) => {
      const { boardId, columnId } = context.req.valid('param');
      const data = context.req.valid('json');
      const column = await this.service.reorderColumn(boardId, columnId, data);
      return context.json(column, 200);
    },
  );

  delete = createHandlers(zodValidator('param', deleteColumnParamsSchema), async (context) => {
    const { boardId, columnId } = context.req.valid('param');
    await this.service.deleteColumn(boardId, columnId);
    return context.body(null, 204);
  });
}

export const columnController = new ColumnController();
