'use client';
import useAuth from '../components/AuthGate';
import Navbar from '../components/Navbar';
import AccrueButton from '../components/AccrueButton';

export default function Admin(){
  const { user, loading } = useAuth();
  if (loading) return <div style={{padding:24}}>Loading...</div>;
  const isAdmin = user?.email === 'herbert7565@gmail.com';
  return (
    <main style={{padding:24, fontFamily:'sans-serif'}}>
      <Navbar email={user?.email}/>
      <h2>Admin</h2>
      <p>Signed in as <strong>{user?.email}</strong>.</p>
      {isAdmin ? (
        <div style={{marginTop:12}}>
          <AccrueButton/>
          <p style={{marginTop:8,opacity:0.8}}>Click once per month to add rent to all tenants’ outstanding.</p>
        </div>
      ) : (
        <p style={{color:'#a00'}}>Only the admin should run accruals.</p>
      )}
    </main>
  );
}
