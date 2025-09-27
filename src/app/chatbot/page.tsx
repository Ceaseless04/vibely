'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/libs/supabaseClient';
import { Message } from '@/types';

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null));
  }, []);

  if (!user) return <p className="text-center mt-10">Please log in to use the chatbot.</p>;

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const token = (await supabase.auth.getSession()).data.session?.access_token;
    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setMessages(prev => [...prev, data]);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div style={{ height: 300, overflowY: 'scroll', border: '1px solid #ccc', padding: 10 }}>
        {messages.map((msg, idx) => <div key={idx}><b>{msg.sender}:</b> {msg.text}</div>)}
      </div>
      <div className="flex mt-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} className="flex-1 border p-2 rounded" placeholder="Ask me about events..." />
        <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">Send</button>
      </div>
    </div>
  );
}
