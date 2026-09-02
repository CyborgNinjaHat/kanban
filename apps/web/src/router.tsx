import { Navigate, createBrowserRouter } from 'react-router';
import { App } from './app';
import { HomePage } from '@/pages/home-page';
import { KanbanPage } from '@/pages/kanban-page';
import { NotFoundPage } from '@/pages/not-found';

export const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: HomePage,
      },
      {
        path: '/boards',
        element: <Navigate to="/" replace />,
      },
      {
        path: '/boards/:boardId',
        Component: KanbanPage,
      },
      {
        path: '*',
        Component: NotFoundPage,
      },
    ],
  },
]);
