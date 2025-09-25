'use client';
import { useState } from 'react';
import useAuth from '../components/AuthGate';
import Navbar from '../components/Navbar';
import { supabase } from '../lib/supabase';

export default function Reports(){
  const { user, loading } = useAuth();
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [tenantRows, setTenantRows] = useState([]);
  const [income, setIncome] = useState(null);

  const run = async () => {
    const { data: tdata, error: terr } = await supabase.rpc('tenant_status_report', { p_start: start, p_end: end });
    if (terr) { alert(terr.message); return; }
    setTenantRows(tdata||[]);
    const { data: idata, error: ierr } = await supabase.rpc('income_statement', { p_start: start, p_end: end });
    if (ierr) { alert(ierr.message); return; }
    setIncome(idata?.[0] || { total_collections:0, total_expenses:0, net_income:0 });
  };

  if (loading) return <div style={{padding:24}}>Loading...</div>;

  return (
    <main style={{padding:24, fontFamily:'sans-serif'}}>
      <Navbar email={user?.email}/>
      <h2>Reports</h2>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <label>Start: <input type="date" value={start} onChange={e=>setStart(e.target.value)}/></label>
        <label>End: <input type="date" value={end} onChange={e=>setEnd(e.target.value)}/></label>
        <button onClick={run}>Run</button>
      </div>

      <h3 style={{marginTop:16}}>Tenant Status</h3>
      <table style={{marginTop:8, borderCollapse:'collapse', width:'100%'}}>
        <thead>
          <tr><th>Unit</th><th>Tenant</th><th>Collections</th><th>Start Outstanding</th><th>End Outstanding</th></tr>
        </thead>
        <tbody>
          {tenantRows.map((r,i)=>(
            <tr key={i}>
              <td>{r.unit_name}</td>
              <td>{r.tenant}</td>
              <td>{r.collections_in_period}</td>
              <td>{r.start_outstanding}</td>
              <td>{r.end_outstanding}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{marginTop:16}}>Income Statement</h3>
      <div style={{display:'flex',gap:24}}>
        <div>Total Collections: <strong>{income?.total_collections ?? 0}</strong></div>
        <div>Total Expenses: <strong>{income?.total_expenses ?? 0}</strong></div>
        <div>Net Income: <strong>{income?.net_income ?? 0}</strong></div>
      </div>
    </main>
  );
}
