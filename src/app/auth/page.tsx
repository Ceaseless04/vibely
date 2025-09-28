'use client'
import { supabase } from '@/libs/supabaseClient';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
	const route = useRouter();

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else {
			alert('Check your email to confirm your account');
			route.push("/chatbot");
		}
	};

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else {
			alert('Logged in!');
			route.push("/chatbot");
		}
	};

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) alert(error.message);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#22223b]">
      <div className="bg-[#4a4e69] rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center border border-[#c9ada7]">
        <h2 className="text-3xl font-bold mb-6 text-[#c9ada7]">Vibely Login</h2>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-[#f2e9e4] text-[#22223b] placeholder-[#22223b] focus:outline-none focus:ring-2 focus:ring-[#c9ada7]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg bg-[#f2e9e4] text-[#22223b] placeholder-[#22223b] focus:outline-none focus:ring-2 focus:ring-[#c9ada7]"
        />
        <div className="flex w-full gap-4 mb-4">
          <button
            onClick={signIn}
            className="flex-1 px-4 py-2 bg-[#9a8c98] text-[#f2e9e4] font-semibold rounded-lg hover:bg-[#c9ada7] hover:text-[#22223b] transition"
          >
            Sign In
          </button>
          <button
            onClick={signUp}
            className="flex-1 px-4 py-2 bg-[#c9ada7] text-[#22223b] font-semibold rounded-lg hover:bg-[#9a8c98] hover:text-[#f2e9e4] transition"
          >
            Sign Up
          </button>
        </div>
        <button
          onClick={signInWithGoogle}
          className="w-full px-4 py-2 bg-[#ea4335] text-white font-semibold rounded-lg hover:bg-[#c1351d] transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
