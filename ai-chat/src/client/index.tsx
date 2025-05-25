import { renderApp } from 'modelence/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { Suspense, lazy } from 'react';

import { AuthenticatedGuard, UnauthenticatedGuard } from './guards';
// @ts-ignore
import favicon from './assets/favicon.png';
import './index.css';

const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <UnauthenticatedGuard />,
    children: [
      {
        index: true,
        element: <HomePage />
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthenticatedGuard />,
    children: [
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'signup',
        element: <SignupPage />
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]);

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}

renderApp({
  routesElement: <App />,
  errorHandler: (error) => {
    toast.error(error.message);
  },
  loadingElement: <div>Loading...</div>,
  favicon
});

