'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function Login(){
  const router = useRouter();
  const [email, setEmail] = useState('herbert7565@gmail.com');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) router.replace('/');
    })();
  }, [router]);

  const send = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined }
    });
    if (error) alert(error.message);
    else setSent(true);
  };

  return (
    <main style={{maxWidth:480,margin:'40px auto',fontFamily:'sans-serif'}}>
      <h1>Sign in</h1>
      <p>Enter your email to receive a magic link.</p>
      <input style={{width:'100%',padding:8,marginBottom:8}} value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/>
      <button onClick={send}>Send magic link</button>
      {sent && <p>Check your inbox for the link.</p>}
    </main>
  );
}
