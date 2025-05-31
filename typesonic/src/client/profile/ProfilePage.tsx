import { useSession } from 'modelence/client';
import { modelenceQuery } from '@modelence/react-query';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import { Page } from '@/client/layout/Page';
import { Card } from '@/client/ui/Card';
import { SpeedWidget } from '@/client/stats';

export default function ProfilePage() {
  const { user } = useSession();
  const { data: sessions, isFetching } = useQuery(modelenceQuery<any[]>('typingSession.getHistory'));

  if (!user) {
    return (
      <Page>
        <Card className="bg-gradient-to-br from-white to-orange-50 mt-12">
          <div className="text-center py-8">
            <p className="text-gray-600">Please sign in to view your profile.</p>
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

  const stats = calculateStats(sessions || []);

  return (
    <Page>
      <div className="space-y-8">
        <ProfileHeader user={user} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <TypingStats stats={stats} />
            <RecentSessions sessions={sessions?.slice(0, 5) || []} isFetching={isFetching} />
          </div>
          <div className="space-y-8">
            <Achievements stats={stats} />
            <QuickActions />
          </div>
        </div>
      </div>
    </Page>
  );
}

function ProfileHeader({ user }: { user: any }) {
  return (
    <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 rounded-full bg-orange-200 flex items-center justify-center text-3xl font-bold text-orange-700">
          {user.handle[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{user.handle.split('@')[0]}</h1>
          <p className="text-gray-600">{user.handle}</p>
          <p className="text-sm text-gray-500 mt-1">Member since {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </Card>
  );
}

function TypingStats({ stats }: { stats: any }) {
  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Typing Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Sessions" 
          value={stats.totalSessions} 
          icon="📊"
        />
        <StatCard 
          title="Average Speed" 
          value={`${stats.averageSpeed} WPM`} 
          icon="⚡"
        />
        <StatCard 
          title="Best Speed" 
          value={`${stats.bestSpeed} WPM`} 
          icon="🏆"
        />
        <StatCard 
          title="Total Time" 
          value={`${Math.round(stats.totalTime / 60)}m`} 
          icon="⏱️"
        />
      </div>
    </Card>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: string }) {
  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
}

function RecentSessions({ sessions, isFetching }: { sessions: any[]; isFetching: boolean }) {
  if (isFetching) {
    return (
      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Sessions</h2>
        <div className="text-center py-8">Loading...</div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recent Sessions</h2>
        <Link 
          to="/typing-history" 
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          View All →
        </Link>
      </div>
      
      {sessions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No typing sessions yet.</p>
          <Link 
            to="/" 
            className="mt-4 inline-block px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Start Your First Session
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session: any) => (
            <SessionCard key={session._id} session={session} />
          ))}
        </div>
      )}
    </Card>
  );
}

function SessionCard({ session }: { session: any }) {
  const date = new Date(session.endDate);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const participant = session.participants[0];
  const speed = participant?.speed ?? 0;

  return (
    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div>
        <div className="font-medium text-gray-900">{formattedDate}</div>
        <div className="text-sm text-gray-500">Session #{session._id.slice(-6)}</div>
      </div>
      <div className="flex items-center space-x-4">
        <SpeedWidget speed={speed} />
        <Link
          to={`/session/${session._id}`}
          className="text-orange-600 hover:text-orange-700 font-medium text-sm"
        >
          View →
        </Link>
      </div>
    </div>
  );
}

function Achievements({ stats }: { stats: any }) {
  const achievements = [
    {
      title: "First Steps",
      description: "Complete your first typing session",
      achieved: stats.totalSessions > 0,
      icon: "🌟"
    },
    {
      title: "Speed Demon",
      description: "Reach 60 WPM",
      achieved: stats.bestSpeed >= 60,
      icon: "🚀"
    },
    {
      title: "Consistency",
      description: "Complete 10 typing sessions",
      achieved: stats.totalSessions >= 10,
      icon: "🎯"
    },
    {
      title: "Marathon Typist",
      description: "Type for 30 minutes total",
      achieved: stats.totalTime >= 1800,
      icon: "🏃"
    }
  ];

  return (
    <Card>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Achievements</h2>
      <div className="space-y-3">
        {achievements.map((achievement, index) => (
          <div 
            key={index}
            className={`p-3 rounded-lg border ${
              achievement.achieved 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-start space-x-3">
              <span className={`text-xl ${achievement.achieved ? '' : 'grayscale opacity-50'}`}>
                {achievement.icon}
              </span>
              <div className="flex-1">
                <div className={`font-medium ${achievement.achieved ? 'text-green-800' : 'text-gray-600'}`}>
                  {achievement.title}
                </div>
                <div className={`text-sm ${achievement.achieved ? 'text-green-600' : 'text-gray-500'}`}>
                  {achievement.description}
                </div>
              </div>
              {achievement.achieved && (
                <span className="text-green-600">✓</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function QuickActions() {
  return (
    <Card>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="space-y-3">
        <Link 
          to="/" 
          className="block w-full p-3 text-center bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Start New Session
        </Link>
        <Link 
          to="/typing-history" 
          className="block w-full p-3 text-center border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
        >
          View All Sessions
        </Link>
      </div>
    </Card>
  );
}

function calculateStats(sessions: any[]) {
  if (!sessions || sessions.length === 0) {
    return {
      totalSessions: 0,
      averageSpeed: 0,
      bestSpeed: 0,
      totalTime: 0
    };
  }

  const speeds = sessions
    .map(session => session.participants[0]?.speed || 0)
    .filter(speed => speed > 0);

  const totalTime = sessions.reduce((total, session) => {
    if (session.startDate && session.endDate) {
      return total + (new Date(session.endDate).getTime() - new Date(session.startDate).getTime()) / 1000;
    }
    return total;
  }, 0);

  return {
    totalSessions: sessions.length,
    averageSpeed: speeds.length > 0 ? Math.round(speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length) : 0,
    bestSpeed: speeds.length > 0 ? Math.max(...speeds) : 0,
    totalTime: totalTime
  };
} 