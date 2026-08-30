import { Hono } from 'hono';
import { cardController } from './card.controller.js';

import type { CardController } from './card.controller.js';

export class CardRoutes {
  private readonly router: Hono;
  private readonly controller: CardController;

  constructor(controller = cardController) {
    this.router = new Hono();
    this.controller = controller;
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router
      .post('/', ...this.controller.create)
      .get('/', ...this.controller.getAll)
      .get('/:cardId', ...this.controller.getById)
      .patch('/:cardId', ...this.controller.update)
      .patch('/:cardId/reorder', ...this.controller.reorder)
      .delete('/:cardId', ...this.controller.delete);
  }

  public mountTo(app: Hono, path: string): void {
    app.route(path, this.router);
  }
}
