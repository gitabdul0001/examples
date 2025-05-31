import { UserProfile } from '@modelence/auth-ui';
import { useSession } from 'modelence/client';
import { Link } from 'react-router-dom';

import { Page } from '@/client/layout/Page';
import { Card } from '@/client/ui/Card';

export default function AccountPage() {
  const { user } = useSession();

  if (!user) {
    return (
      <Page>
        <Card className="bg-gradient-to-br from-white to-orange-50 mt-12">
          <div className="text-center py-8">
            <p className="text-gray-600">Please sign in to view your account settings.</p>
            <Link 
              to="/login" 
              className="mt-4 inline-block px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Sign In
            </Link>
          </div>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <div className="space-y-8">
        <UserProfile />
      </div>
    </Page>
  );
}
