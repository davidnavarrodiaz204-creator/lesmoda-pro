// frontend/src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.ok) navigate('/admin');
    else setError(result.message);
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>Les<em style={{color:'#C9A96E'}}>Mo</em>da</div>
        <h2 style={s.title}>Panel Administrador</h2>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.group}>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" value={email}
              onChange={e => setEmail(e.target.value)} placeholder="admin@lesmoda.com" required />
          </div>
          <div style={s.group}>
            <label style={s.label}>Contraseña</label>
            <input style={s.input} type="password" value={password}
              onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
        <a href="/" style={s.back}>← Ver tienda</a>
      </div>
    </div>
  );
}

const s = {
  page:  { minHeight:'100vh', background:'#FAF7F2', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' },
  card:  { background:'white', borderRadius:16, padding:'2.5rem 2rem', width:'100%', maxWidth:400, boxShadow:'0 8px 40px rgba(0,0,0,0.1)', textAlign:'center' },
  logo:  { fontFamily:'serif', fontSize:'2rem', color:'#1A1612', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.5rem' },
  title: { fontFamily:'serif', fontSize:'1.1rem', color:'#8A7968', fontWeight:400, marginBottom:'1.5rem' },
  error: { background:'#FFF5F5', border:'1px solid #F5C0C0', color:'#C25E5E', padding:'0.7rem', borderRadius:8, marginBottom:'1rem', fontSize:'0.88rem' },
  form:  { display:'flex', flexDirection:'column', gap:'1rem', textAlign:'left' },
  group: { display:'flex', flexDirection:'column', gap:'0.38rem' },
  label: { fontSize:'0.75rem', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:'#8A7968' },
  input: { border:'1.5px solid #E0D8CE', borderRadius:8, padding:'0.65rem 0.85rem', fontFamily:'sans-serif', fontSize:'0.9rem', outline:'none' },
  btn:   { background:'#1A1612', color:'#C9A96E', border:'none', fontFamily:'sans-serif', fontSize:'0.9rem', fontWeight:700, padding:'0.7rem', borderRadius:8, cursor:'pointer', marginTop:'0.5rem' },
  back:  { display:'inline-block', marginTop:'1.5rem', fontSize:'0.82rem', color:'#8A7968' },
};
