'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function useAuth(){
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!ignore){
        setUser(session?.user || null);
        setLoading(false);
        if (!session?.user){
          router.replace('/login');
        }
      }
    })();
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session?.user) router.replace('/login');
    });
    return () => {
      ignore = true;
      try { subscription.subscription?.unsubscribe?.(); } catch {}
    };
  }, [router]);

  return { user, loading };
}
