import { useSession } from 'modelence/client';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import PostHistory from '../components/PostHistory';

export default function PostsPage() {
  const { user } = useSession();

  if (!user) {
    return (
      <Layout>
        <div className="max-w-md mx-auto">
          <Card className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
            <p className="text-gray-600 mb-6">Please sign in to view your posts.</p>
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
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Posts</h1>
            <p className="text-gray-600">Manage your generated social media posts</p>
          </div>
          <Link to="/generator">
            <Button variant="primary">Generate New Post</Button>
          </Link>
        </div>
        
        <PostHistory />
      </div>
    </Layout>
  );
}