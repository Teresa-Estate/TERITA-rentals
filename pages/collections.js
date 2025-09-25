'use client';
import { useEffect, useState } from 'react';
import useAuth from '../components/AuthGate';
import Navbar from '../components/Navbar';
import { supabase } from '../lib/supabase';

const UNITS = ['Rita','Teresa'];

export default function Collections(){
  const { user, loading } = useAuth();
  const [rows, setRows] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState({ unit_name:'Rita', tenant:'', date:'', amount:0 });
  const [editing, setEditing] = useState(null); // id

  const load = async () => {
    const { data, error } = await supabase.from('collections').select('*').order('date',{ascending:false}).limit(200);
    if (error) alert(error.message); else setRows(data||[]);
    const { data: ts } = await supabase.from('tenants').select('tenant,unit_name').order('unit_name').order('tenant');
    setTenants(ts||[]);
  };
  useEffect(()=>{ if(!loading) load(); },[loading]);

  const save = async () => {
    if (editing){
      const { error } = await supabase.from('collections').update(form).eq('id', editing);
      if (error) alert(error.message);
      else { setEditing(null); setForm({ unit_name:'Rita', tenant:'', date:'', amount:0 }); load(); }
    } else {
      const { error } = await supabase.from('collections').insert([form]);
      if (error) alert(error.message);
      else { setForm({ unit_name:'Rita', tenant:'', date:'', amount:0 }); load(); }
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this collection?')) return;
    const { error } = await supabase.from('collections').delete().eq('id', id);
    if (error) alert(error.message); else load();
  };

  const startEdit = (r) => {
    setEditing(r.id);
    setForm({ unit_name:r.unit_name, tenant:r.tenant, date:r.date, amount:r.amount });
  };

  if (loading) return <div style={{padding:24}}>Loading...</div>;

  const tenantOptions = tenants.filter(t => t.unit_name === form.unit_name);

  return (
    <main style={{padding:24, fontFamily:'sans-serif'}}>
      <Navbar email={user?.email}/>
      <h2>Collections</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:8, maxWidth:900, marginBottom:12}}>
        <select value={form.unit_name} onChange={e=>setForm({...form, unit_name:e.target.value, tenant:''})}>
          {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <select value={form.tenant} onChange={e=>setForm({...form, tenant:e.target.value})}>
          <option value="">-- tenant --</option>
          {tenantOptions.map(t => <option key={t.unit_name+'_'+t.tenant} value={t.tenant}>{t.tenant}</option>)}
        </select>
        <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})}/>
        <input type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={e=>setForm({...form, amount: parseFloat(e.target.value||'0')})}/>
      </div>
      <button onClick={save}>{editing ? 'Update' : 'Add'} Collection</button>
      {editing && <button onClick={()=>{setEditing(null); setForm({ unit_name:'Rita', tenant:'', date:'', amount:0 });}} style={{marginLeft:8}}>Cancel</button>}

      <table style={{marginTop:16, borderCollapse:'collapse', width:'100%'}}>
        <thead>
          <tr><th>Date</th><th>Unit</th><th>Tenant</th><th>Amount</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {rows.map((r)=>(
            <tr key={r.id}>
              <td>{r.date}</td>
              <td>{r.unit_name}</td>
              <td>{r.tenant}</td>
              <td>{r.amount}</td>
              <td>
                <button onClick={()=>startEdit(r)}>Edit</button>
                <button onClick={()=>remove(r.id)} style={{marginLeft:8}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
