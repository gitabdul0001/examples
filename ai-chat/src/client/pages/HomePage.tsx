// @ts-ignore
import logo from '../assets/modelence.png';
import { useState } from 'react';
import { useMutation } from 'modelence/client';
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const { mutateAsync: generateResponse, isFetching } = useMutation<ChatMessage>('aiChat.generateResponse');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    
    const aiMessage = await generateResponse({ messages: updatedMessages });
    setMessages(prev => [...prev, aiMessage]);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="flex items-center justify-center p-4 border-b bg-white">
        <img src={logo} alt="Modelence Logo" className="w-8 h-8" />
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-3xl mx-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-100 ml-12' 
                  : 'bg-white mr-12'
              }`}
            >
              {message.content}
            </div>
          ))}
          {isFetching && (
            <div className="bg-white mr-12 p-4 rounded-lg">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border-t p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              rows={1}
              className="flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-y-auto"
              placeholder="Type your message... (Shift + Enter for new line)"
              style={{ minHeight: '42px', maxHeight: '200px' }}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
