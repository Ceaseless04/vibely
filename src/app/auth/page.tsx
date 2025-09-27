'use client'
import { supabase } from '@/libs/supabaseClient';
import { useState } from 'react';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert('Check your email to confirm your account');
  };

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else alert('Logged in!');
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) alert(error.message);
  };

  return (
    <div className="flex flex-col items-center mt-10 space-y-2">
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 rounded"/>
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 rounded"/>
      <div className="space-x-2">
        <button onClick={signIn} className="px-4 py-2 bg-blue-500 text-white rounded">Sign In</button>
        <button onClick={signUp} className="px-4 py-2 bg-green-500 text-white rounded">Sign Up</button>
      </div>
      <button onClick={signInWithGoogle} className="mt-2 px-4 py-2 bg-red-500 text-white rounded">Sign in with Google</button>
    </div>
  );
}
