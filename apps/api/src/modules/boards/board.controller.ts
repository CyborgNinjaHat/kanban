import {
  createBoardBodySchema,
  deleteBoardParamsSchema,
  getBoardParamsSchema,
  listBoardsQuerySchema,
  updateBoardBodySchema,
  updateBoardParamsSchema,
} from '@kanban/contracts';
import { createHandlers } from '../../common/core/hono-factory.js';
import { zodValidator } from '../../middlewares/zod-validator-middleware.js';
import { boardService } from './board.service.js';

import type { BoardService } from './board.service.js';

export class BoardController {
  private readonly service: BoardService;

  constructor(service: BoardService = boardService) {
    this.service = service;
  }

  create = createHandlers(zodValidator('json', createBoardBodySchema), async (context) => {
    const data = context.req.valid('json');
    const board = await this.service.createBoard(data);
    return context.json(board, 201);
  });

  getAll = createHandlers(zodValidator('query', listBoardsQuerySchema), async (context) => {
    const query = context.req.valid('query');
    const boards = await this.service.getAllBoards(query);
    return context.json(boards, 200);
  });

  getById = createHandlers(zodValidator('param', getBoardParamsSchema), async (context) => {
    const { id } = context.req.valid('param');
    const board = await this.service.getBoardById(id);
    return context.json(board, 200);
  });

  getView = createHandlers(zodValidator('param', getBoardParamsSchema), async (context) => {
    const { id } = context.req.valid('param');
    const board = await this.service.getBoardViewById(id);
    return context.json(board, 200);
  });

  update = createHandlers(
    zodValidator('param', updateBoardParamsSchema),
    zodValidator('json', updateBoardBodySchema),
    async (context) => {
      const { id } = context.req.valid('param');
      const data = context.req.valid('json');

      const updatedBoard = await this.service.updateBoard(id, data);
      return context.json(updatedBoard, 200);
    },
  );

  delete = createHandlers(zodValidator('param', deleteBoardParamsSchema), async (context) => {
    const { id } = context.req.valid('param');
    await this.service.deleteBoard(id);
    return context.body(null, 204);
  });
}

export const boardController = new BoardController();
