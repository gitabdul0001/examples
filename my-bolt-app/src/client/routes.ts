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
  // Add more routes as needed for your specific features
  // {
  //   path: '/feature1',
  //   Component: lazy(() => import('./pages/Feature1Page'))
  // },
];