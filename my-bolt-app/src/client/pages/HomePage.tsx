import { useSession } from 'modelence/client';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';

export default function HomePage() {
  const { user } = useSession();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to My Bolt App
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {user ? `Hello, ${user.handle?.split('@')[0] || 'User'}!` : 'Get started with your new application'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            title="Feature 1"
            description="Add your first feature description here"
            icon="🚀"
            link="/feature1"
          />
          <FeatureCard
            title="Feature 2"
            description="Add your second feature description here"
            icon="⚡"
            link="/feature2"
          />
          <FeatureCard
            title="Feature 3"
            description="Add your third feature description here"
            icon="🎯"
            link="/feature3"
          />
        </div>

        {!user && (
          <Card className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to get started?
            </h2>
            <p className="text-gray-600 mb-6">
              Sign up now to access all features and save your progress.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/signup">
                <Button variant="primary" size="lg">
                  Sign Up
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
}

function FeatureCard({ title, description, icon, link }: FeatureCardProps) {
  return (
    <Card className="text-center hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link to={link}>
        <Button variant="outline" size="sm">
          Learn More
        </Button>
      </Link>
    </Card>
  );
}