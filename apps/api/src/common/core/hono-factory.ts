import { Factory } from 'hono/factory';

const factory = new Factory();

export const createApp = factory.createApp;
export const createHandlers = factory.createHandlers;
export const createMiddleware = factory.createMiddleware;
