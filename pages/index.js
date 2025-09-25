'use client';
import useAuth from '../components/AuthGate';
import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function Home(){
  const { user, loading } = useAuth();
  if (loading) return <div style={{padding:24}}>Loading...</div>;
  return (
    <main style={{padding: 24, fontFamily: 'sans-serif'}}>
      <Navbar email={user?.email}/>
      <h1>Teresa Estate — Rentals App</h1>
      <p>Choose a section:</p>
      <ul>
        <li><Link href="/tenants">Tenants</Link></li>
        <li><Link href="/collections">Collections</Link></li>
        <li><Link href="/expenses">Expenses</Link></li>
        <li><Link href="/reports">Reports</Link></li>
        <li><Link href="/admin">Admin</Link></li>
      </ul>
    </main>
  );
}
