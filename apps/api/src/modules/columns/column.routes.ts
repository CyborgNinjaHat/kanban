import { Hono } from 'hono';
import { columnController } from './column.controller.js';

import type { ColumnController } from './column.controller.js';

export class ColumnRoutes {
  private readonly router: Hono;
  private readonly controller: ColumnController;

  constructor(controller = columnController) {
    this.router = new Hono();
    this.controller = controller;
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router
      .post('/', ...this.controller.create)
      .get('/', ...this.controller.getAll)
      .get('/:columnId', ...this.controller.getById)
      .patch('/:columnId', ...this.controller.update)
      .patch('/:columnId/reorder', ...this.controller.reorder)
      .delete('/:columnId', ...this.controller.delete);
  }

  public mountTo(app: Hono, path: string): void {
    app.route(path, this.router);
  }
}
