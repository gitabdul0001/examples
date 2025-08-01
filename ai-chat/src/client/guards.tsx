import { Navigate, useLocation, Outlet, useSearchParams } from 'react-router-dom';
import { useSession } from 'modelence/client';

// Redirect authenticated users away from auth pages (login, signup, etc)
export function AuthenticatedGuard() {
  const { user } = useSession();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const encodedRedirect = searchParams.get('_redirect');
  const redirect = encodedRedirect ? decodeURIComponent(encodedRedirect) : '/';

  if (user) {
    return <Navigate to={redirect} state={{ from: location }} replace />;
  }

  return <Outlet />;
}

// Protect routes that require authentication
export function UnauthenticatedGuard() {
  const { user } = useSession();
  const location = useLocation();

  if (!user) {
    const fullPath = location.pathname + location.search;
    return <Navigate 
      to={`/auth/login?_redirect=${encodeURIComponent(fullPath)}`}
      state={{ from: location }}
      replace 
    />;
  }

  return <Outlet />;
}
