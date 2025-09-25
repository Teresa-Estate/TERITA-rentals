'use client';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function Navbar({ email }){
  const router = useRouter();
  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };
  return (
    <nav style={{display:'flex',gap:12,alignItems:'center',padding:12,borderBottom:'1px solid #eee',marginBottom:16}}>
      <strong>Teresa Estate</strong>
      <Link href="/">Dashboard</Link>
      <Link href="/tenants">Tenants</Link>
      <Link href="/collections">Collections</Link>
      <Link href="/expenses">Expenses</Link>
      <Link href="/reports">Reports</Link>
      <Link href="/admin">Admin</Link>
      <div style={{marginLeft:'auto',opacity:0.8}}>{email || ''}</div>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}
