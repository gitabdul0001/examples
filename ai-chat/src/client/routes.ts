import { lazy } from 'react';

export const routes = [
  {
    path: '/',
    Component: lazy(() => import('./pages/HomePage'))
  },
  {
    path: '/login',
    Component: lazy(() => import('./pages/LoginPage'))
  },
];
