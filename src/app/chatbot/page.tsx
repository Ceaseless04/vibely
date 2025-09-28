'use client'

import Navbar from '@/components/NavBar';
import Sidebar from '@/components/SideBar';
import { supabase } from '@/libs/supabaseClient';
import { Message, UserChat } from '@/types';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Chatbot() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [eventList, setEventList] = useState<any[]>([]); // For map modal
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chats, setChats] = useState<UserChat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    // Ask for user location on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => console.log('Location error:', err)
      );
    }
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null));
  }, []);

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen bg-blackCustom">
      <div className="bg-navyBlue rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6 text-babyBlue">Please log in to use the chatbot.</h2>
      </div>
    </div>
  );

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = { sender: 'user', text: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    const token = (await supabase.auth.getSession()).data.session?.access_token;

    // Check if prompt mentions a location
    const locationPattern = /in\s+([a-zA-Z\s]+)/i;
    const mentionsLocation = locationPattern.test(input);
    const body: any = { message: input };
    if (!mentionsLocation && userLocation) {
      body.userCoords = userLocation;
    }
    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });

    const data = await res.json();
  const botMessage: Message = { sender: 'bot', text: data.text, timestamp: new Date().toISOString() };
  setMessages(prev => [...prev, botMessage]);
  // If events are present in response, store for map
  if (data.events) setEventList(data.events);

    // Save or update chat in state
    if (!selectedChatId) {
      const newChat: UserChat = {
        id: crypto.randomUUID(),
        title: input,
        messages: [newMessage, botMessage],
        createdAt: new Date().toISOString(),
      };
      setChats(prev => [newChat, ...prev]);
      setSelectedChatId(newChat.id);
    } else {
      setChats(prev =>
        prev.map(chat =>
          chat.id === selectedChatId ? { ...chat, messages: [...chat.messages, newMessage, botMessage] } : chat
        )
      );
    }
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    const chat = chats.find(c => c.id === chatId);
    setMessages(chat?.messages || []);
  };

  return (
    <div className="flex h-screen bg-[#22223b]">
      {/* Sidebar */}
      <Sidebar chats={chats} selectedChatId={selectedChatId} onSelect={handleSelectChat} />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-end overflow-hidden">
          {/* Chat Window */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4 bg-[#4a4e69]">
            {messages.length === 0 ? (
              <div className="text-center text-[#c9ada7] mt-20 text-lg">Start a conversation!</div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl shadow-md break-words text-base font-medium border ${
                      msg.sender === 'user'
                        ? 'bg-[#c9ada7] text-[#22223b] border-[#9a8c98]'
                        : 'bg-[#f2e9e4] text-[#22223b] border-[#c9ada7]'
                    }`}
                  >
                    {msg.sender === 'bot' ? (
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))
            )}
            {/* See events on a map section */}
            {eventList.length > 0 && (
              <div className="mt-8 flex flex-col items-center">
                <div className="mb-2 text-lg text-[#c9ada7]">Would you like to see these events on a map?</div>
                <button
                  className="px-4 py-2 bg-[#9a8c98] text-[#f2e9e4] rounded-lg font-semibold shadow hover:bg-[#c9ada7] hover:text-[#22223b] transition"
                  onClick={() => setShowMap(true)}
                >
                  Show Map
                </button>
              </div>
            )}
            {/* Map Modal */}
            {showMap && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-[#f2e9e4] rounded-2xl shadow-lg p-8 w-full max-w-2xl relative">
                  <button
                    className="absolute top-4 right-4 px-3 py-1 bg-[#9a8c98] text-[#f2e9e4] rounded"
                    onClick={() => setShowMap(false)}
                  >
                    Close
                  </button>
                  <h3 className="text-2xl font-bold mb-4 text-[#22223b]">Events Map</h3>
                  {/* Map and filters will go here */}
                  <div className="text-[#22223b]">Map coming soon...</div>
                </div>
              </div>
            )}
          </div>
          {/* Input */}
          <div className="sticky bottom-0 w-full bg-[#22223b] px-8 py-6 flex gap-4 items-center border-t border-[#c9ada7]">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 p-4 rounded-xl text-[#22223b] bg-[#f2e9e4] placeholder-[#22223b] focus:outline-none focus:ring-2 focus:ring-[#c9ada7]"
              placeholder="Type your message..."
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="px-6 py-3 bg-[#9a8c98] text-[#f2e9e4] font-bold rounded-xl shadow hover:bg-[#c9ada7] hover:text-[#22223b] transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}