import { useSession } from 'modelence/client';
import { modelenceQuery } from '@modelence/react-query';
import { useQuery } from '@tanstack/react-query';
import { Page } from '@/client/layout/Page';
import { Card } from '@/client/ui/Card';
import { SpeedWidget } from '@/client/stats';
import { Link } from 'react-router-dom';

export default function TypingHistoryPage() {
  const { data: sessions, isFetching, error } = useQuery(modelenceQuery<any[]>('typingSession.getHistory'));

  if (isFetching) {
    return (
      <Page>
        <Card className="bg-gradient-to-br from-white to-orange-50 mt-12">
          <div className="text-center py-8">Loading...</div>
        </Card>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Card className="bg-gradient-to-br from-white to-orange-50 mt-12">
          <div className="text-center py-8 text-red-600">
            {error.message}
          </div>
        </Card>
      </Page>
    );
  }

  return (
    <Page className="bg-gradient-to-br from-white to-orange-50">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Typing History</h1>
        <div className="space-y-4">
          {sessions?.map((session: any) => (
            <TypingSessionCard key={session._id} session={session} />
          ))}
        </div>
      </div>
    </Page>
  );
}

function TypingSessionCard({ session }: { session: any }) {
  const { user } = useSession();

  const date = new Date(session.endDate);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const participant = session.participants.find((p: any) => p.userId === user.id);

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="text-sm text-gray-500">{formattedDate}</div>
          <Link
            to={`/session/${session._id}`}
            className="inline-block mt-2 text-orange-600 hover:text-orange-700 font-medium text-sm"
          >
            View Results →
          </Link>
        </div>
        <SpeedWidget speed={participant?.speed} />
      </div>
    </div>
  );
}
