import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useSession, logout } from 'modelence/client';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export default function Layout({ children, className = '' }: LayoutProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

function Header() {
  const { user } = useSession();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
            My Bolt App
          </Link>
          
          <nav className="flex items-center space-x-4">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

function UserMenu({ user }: { user: any }) {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {user.handle?.[0]?.toUpperCase() || 'U'}
        </div>
        <span>{user.handle?.split('@')[0] || 'User'}</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-10">
        <div className="py-2">
          <Link 
            to="/profile" 
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Profile
          </Link>
          <Link 
            to="/settings" 
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Settings
          </Link>
          <hr className="my-2" />
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}