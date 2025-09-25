'use client';
import { useEffect, useState } from 'react';
import useAuth from '../components/AuthGate';
import Navbar from '../components/Navbar';
import { supabase } from '../lib/supabase';

const UNITS = ['Rita','Teresa'];

export default function Tenants(){
  const { user, loading } = useAuth();
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ unit_name:'Rita', tenant:'', rent_value:0, outstanding:0 });
  const [editing, setEditing] = useState(null); // {unit_name, tenant}

  const load = async () => {
    const { data, error } = await supabase.from('tenants').select('*').order('unit_name',{ascending:true}).order('tenant',{ascending:true});
    if (error) alert(error.message); else setRows(data||[]);
  };
  useEffect(()=>{ if(!loading) load(); },[loading]);

  const save = async () => {
    if (editing){
      const { error } = await supabase.from('tenants')
        .update({ unit_name: form.unit_name, tenant: form.tenant, rent_value: form.rent_value, outstanding: form.outstanding })
        .eq('unit_name', editing.unit_name).eq('tenant', editing.tenant);
      if (error) alert(error.message);
      else { setEditing(null); setForm({ unit_name:'Rita', tenant:'', rent_value:0, outstanding:0 }); load(); }
    } else {
      const { error } = await supabase.from('tenants').insert([form]);
      if (error) alert(error.message);
      else { setForm({ unit_name:'Rita', tenant:'', rent_value:0, outstanding:0 }); load(); }
    }
  };

  const remove = async (r) => {
    if (!confirm('Delete this tenant?')) return;
    const { error } = await supabase.from('tenants').delete().eq('unit_name', r.unit_name).eq('tenant', r.tenant);
    if (error) alert(error.message); else load();
  };

  const startEdit = (r) => {
    setEditing({ unit_name: r.unit_name, tenant: r.tenant });
    setForm({ unit_name: r.unit_name, tenant: r.tenant, rent_value: r.rent_value, outstanding: r.outstanding });
  };

  if (loading) return <div style={{padding:24}}>Loading...</div>;

  return (
    <main style={{padding:24, fontFamily:'sans-serif'}}>
      <Navbar email={user?.email}/>
      <h2>Tenants</h2>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:8, maxWidth:900, marginBottom:12}}>
        <select value={form.unit_name} onChange={e=>setForm({...form, unit_name: e.target.value})}>
          {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <input placeholder="Tenant name" value={form.tenant} onChange={e=>setForm({...form, tenant:e.target.value})}/>
        <input type="number" step="0.01" placeholder="Rent value" value={form.rent_value} onChange={e=>setForm({...form, rent_value: parseFloat(e.target.value||'0')})}/>
        <input type="number" step="0.01" placeholder="Outstanding" value={form.outstanding} onChange={e=>setForm({...form, outstanding: parseFloat(e.target.value||'0')})}/>
      </div>
      <button onClick={save}>{editing ? 'Update' : 'Add'} Tenant</button>
      {editing && <button onClick={()=>{setEditing(null); setForm({ unit_name:'Rita', tenant:'', rent_value:0, outstanding:0 });}} style={{marginLeft:8}}>Cancel</button>}

      <table style={{marginTop:16, borderCollapse:'collapse', width:'100%'}}>
        <thead>
          <tr><th>Unit</th><th>Tenant</th><th>Rent</th><th>Outstanding</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i}>
              <td>{r.unit_name}</td>
              <td>{r.tenant}</td>
              <td>{r.rent_value}</td>
              <td>{r.outstanding}</td>
              <td>
                <button onClick={()=>startEdit(r)}>Edit</button>
                <button onClick={()=>remove(r)} style={{marginLeft:8}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
