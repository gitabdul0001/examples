import Page from '../components/Page';
import ChatSidebar from '../components/ChatSidebar';
import ChatMessages from '../components/ChatMessages';

export default function HomePage() {
  return (
    <Page>
      <div className="flex min-h-0 h-full">
        <ChatSidebar />
        <ChatMessages />
      </div>
    </Page>
  );
}
