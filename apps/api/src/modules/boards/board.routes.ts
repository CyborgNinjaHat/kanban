import { Hono } from 'hono';
import { boardController } from './board.controller.js';

import type { BoardController } from './board.controller.js';

export class BoardRoutes {
  private readonly router: Hono;
  private readonly controller: BoardController;

  constructor(controller = boardController) {
    this.router = new Hono();
    this.controller = controller;
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router
      .post('/', ...this.controller.create)
      .get('/', ...this.controller.getAll)
      .get('/:id/view', ...this.controller.getView)
      .get('/:id', ...this.controller.getById)
      .patch('/:id', ...this.controller.update)
      .delete('/:id', ...this.controller.delete);
  }

  public mountTo(app: Hono, path: string): void {
    app.route(path, this.router);
  }
}
