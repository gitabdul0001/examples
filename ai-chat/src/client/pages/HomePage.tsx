// @ts-ignore
import Header from '../components/Header';
import ChatSidebar from '../components/ChatSidebar';
import ChatMessages from '../components/ChatMessages';

export default function HomePage() {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />
      
      <div className="flex-1 flex min-h-0">
        <ChatSidebar />
        <ChatMessages />
      </div>
    </div>
  );
}
  