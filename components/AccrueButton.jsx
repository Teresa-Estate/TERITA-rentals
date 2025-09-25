'use client';
import { supabase } from '../lib/supabase';

export default function AccrueButton(){
  const click = async () => {
    const { error } = await supabase.rpc('accrue_current_month');
    if (error) alert(error.message);
    else alert('Accrued for this month.');
  };
  return <button onClick={click}>Accrue This Month</button>;
}
