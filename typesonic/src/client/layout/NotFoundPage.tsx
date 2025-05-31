import { Link } from 'react-router-dom';
import { Page } from '@/client/layout/Page';
import { Card } from '@/client/ui/Card';

export default function NotFoundPage() {
  return (
    <Page>
      <Card className="bg-gradient-to-br from-blue-50 to-orange-50 mt-12">
        <div className="max-w-md mx-auto py-12 px-4 space-y-10">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600">
              The page you're looking for doesn't exist.
            </p>
          </div>
          
          <div className="space-y-6">
            <Link
              to="/"
              className="block w-full px-4 py-3 text-orange-600 border border-orange-600 rounded-lg font-medium bg-white hover:bg-orange-50 transition-colors text-center"
            >
              Return Home
            </Link>
          </div>
        </div>
      </Card>
    </Page>
  );
}
