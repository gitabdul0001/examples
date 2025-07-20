import { useSession } from 'modelence/client';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import PostGenerator from '../components/PostGenerator';

export default function GeneratorPage() {
  const { user } = useSession();

  if (!user) {
    return (
      <Layout>
        <div className="max-w-md mx-auto">
          <Card className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
            <p className="text-gray-600 mb-6">Please sign in to use the AI post generator.</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Social Media Post Generator</h1>
          <p className="text-gray-600">Create engaging social media content with the power of AI</p>
        </div>
        
        <PostGenerator />
      </div>
    </Layout>
  );
}