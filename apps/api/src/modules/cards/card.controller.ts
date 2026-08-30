import {
  cardColumnParamsSchema,
  cardParamsSchema,
  createCardBodySchema,
  reorderCardBodySchema,
  updateCardBodySchema,
} from '@kanban/contracts';
import { createHandlers } from '../../common/core/hono-factory.js';
import { zodValidator } from '../../middlewares/zod-validator-middleware.js';
import { cardService } from './card.service.js';

import type { CardService } from './card.service.js';

export class CardController {
  private readonly service: CardService;

  constructor(service: CardService = cardService) {
    this.service = service;
  }

  getAll = createHandlers(zodValidator('param', cardColumnParamsSchema), async (context) => {
    const { boardId, columnId } = context.req.valid('param');
    const cards = await this.service.getCards(boardId, columnId);
    return context.json(cards, 200);
  });

  create = createHandlers(
    zodValidator('param', cardColumnParamsSchema),
    zodValidator('json', createCardBodySchema),
    async (context) => {
      const { boardId, columnId } = context.req.valid('param');
      const data = context.req.valid('json');
      const card = await this.service.createCard(boardId, columnId, data);
      return context.json(card, 201);
    },
  );

  getById = createHandlers(zodValidator('param', cardParamsSchema), async (context) => {
    const { boardId, columnId, cardId } = context.req.valid('param');
    const card = await this.service.getCardById(boardId, columnId, cardId);
    return context.json(card, 200);
  });

  update = createHandlers(
    zodValidator('param', cardParamsSchema),
    zodValidator('json', updateCardBodySchema),
    async (context) => {
      const { boardId, columnId, cardId } = context.req.valid('param');
      const data = context.req.valid('json');
      const card = await this.service.updateCard(boardId, columnId, cardId, data);
      return context.json(card, 200);
    },
  );

  reorder = createHandlers(
    zodValidator('param', cardParamsSchema),
    zodValidator('json', reorderCardBodySchema),
    async (context) => {
      const { boardId, columnId, cardId } = context.req.valid('param');
      const data = context.req.valid('json');
      const card = await this.service.reorderCard(boardId, columnId, cardId, data);
      return context.json(card, 200);
    },
  );

  delete = createHandlers(zodValidator('param', cardParamsSchema), async (context) => {
    const { boardId, columnId, cardId } = context.req.valid('param');
    await this.service.deleteCard(boardId, columnId, cardId);
    return context.body(null, 204);
  });
}

export const cardController = new CardController();
