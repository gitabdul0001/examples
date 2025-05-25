import { renderApp } from 'modelence/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { Suspense } from 'react';

import { routes } from './routes';
// @ts-ignore
import favicon from './assets/favicon.png';
import './index.css';

renderApp({
  routesElement: (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={<route.Component />} />
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  ),
  errorHandler: (error) => {
    toast.error(error.message);
  },
  loadingElement: <div>Loading...</div>,
  favicon
});

