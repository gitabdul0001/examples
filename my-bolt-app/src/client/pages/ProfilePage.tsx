import { useSession } from 'modelence/client';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';

export default function ProfilePage() {
  const { user } = useSession();

  if (!user) {
    return (
      <Layout>
        <div className="max-w-md mx-auto">
          <Card className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">Please sign in to view your profile.</p>
            <Link to="/login">
              <Button variant="primary">Sign In</Button>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.handle?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.handle?.split('@')[0] || 'User'}
              </h1>
              <p className="text-gray-600">{user.handle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Account Status</h3>
              <p className="text-green-600">Active</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Member Since</h3>
              <p className="text-gray-600">Recently joined</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/settings" className="block">
              <Button variant="outline" className="w-full justify-start">
                Account Settings
              </Button>
            </Link>
            <Link to="/" className="block">
              <Button variant="outline" className="w-full justify-start">
                Back to Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </Layout>
  );
}