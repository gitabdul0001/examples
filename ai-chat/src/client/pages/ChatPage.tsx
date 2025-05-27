import { useParams } from 'react-router-dom';
import { useQuery } from 'modelence/client';
import Page from '../components/Page';
import ChatSidebar from '../components/ChatSidebar';
import ChatMessages from '../components/ChatMessages';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  messages: ChatMessage[];
  chatTitle: string;
}

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const { data, isFetching } = useQuery<ChatResponse>(`aiChat.getMessages`, { chatId });
  const messages = data?.messages ?? [];

  return (
    <Page>
      <div className="flex min-h-0 h-full">
        <ChatSidebar />
        <div className="flex-1 flex flex-col">
          {isFetching ? (
            <div className="p-4 border-b bg-white">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
              </div>
            </div>
          ) : (
            <>
              {data?.chatTitle && (
                <div className="p-4 border-b bg-white">
                  <h1 className="text-lg font-semibold text-gray-800">{data.chatTitle}</h1>
                </div>
              )}
              <ChatMessages initialMessages={messages} chatId={chatId} />
            </>
          )}
        </div>
      </div>
    </Page>
  );
}
