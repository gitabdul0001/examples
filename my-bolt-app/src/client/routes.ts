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
  {
    path: '/signup',
    Component: lazy(() => import('./pages/SignupPage'))
  },
  {
    path: '/profile',
    Component: lazy(() => import('./pages/ProfilePage'))
  },
  {
    path: '/generator',
    Component: lazy(() => import('./pages/GeneratorPage'))
  },
  {
    path: '/posts',
    Component: lazy(() => import('./pages/PostsPage'))
  },
];