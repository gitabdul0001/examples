import { renderApp } from 'modelence/client';
import { toast } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { routes } from './routes';
// @ts-ignore
import favicon from './assets/favicon.svg';
import './index.css';

renderApp({
  routesElement: (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={<route.Component />} />
        ))}
      </Routes>
    </BrowserRouter>
  ),
  errorHandler: (error) => {
    toast.error(error.message);
  },
  loadingElement: <div>Loading...</div>,
  favicon
});

