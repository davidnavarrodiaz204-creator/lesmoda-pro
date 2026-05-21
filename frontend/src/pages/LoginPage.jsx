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
        <div style={s.logo}>
          LeisModa
        </div>
        <h2 style={s.title}>Panel Administrador</h2>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.group}>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@lesmoda.com"
              autoComplete="email"
              required />
          </div>
          <div style={s.group}>
            <label style={s.label}>Contraseña</label>
            <input style={s.input} type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required />
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
  page:  {
    minHeight:'100vh',
    background:'var(--lm-secondary)',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    padding:'1rem',
  },
  card:  {
    background:'var(--lm-surface)',
    borderRadius:16,
    padding:'2.5rem 2rem',
    width:'100%',
    maxWidth:400,
    boxShadow:'0 24px 80px rgba(0,0,0,0.4)',
    textAlign:'center',
  },
  logo:  {
    fontFamily:'var(--lm-font-heading, serif)',
    fontSize:'2.2rem',
    color:'var(--lm-text)',
    letterSpacing:'0.08em',
    marginBottom:'0.4rem',
  },
  title: {
    fontFamily:'var(--lm-font-heading, serif)',
    fontSize:'1rem',
    color:'var(--lm-muted)',
    fontWeight:400,
    marginBottom:'1.75rem',
  },
  error: {
    background:'#FFF5F5',
    border:'1px solid #F5C0C0',
    color:'var(--lm-danger)',
    padding:'0.75rem',
    borderRadius:8,
    marginBottom:'1rem',
    fontSize:'0.88rem',
    textAlign:'left',
  },
  form:  { display:'flex', flexDirection:'column', gap:'1rem', textAlign:'left' },
  group: { display:'flex', flexDirection:'column', gap:'0.38rem' },
  label: {
    fontSize:'0.73rem',
    fontWeight:600,
    letterSpacing:'0.1em',
    textTransform:'uppercase',
    color:'var(--lm-muted)',
  },
  input: {
    border:'1.5px solid var(--lm-border)',
    borderRadius:8,
    padding:'0.75rem 1rem',
    fontFamily:'sans-serif',
    fontSize:'1rem',
    outline:'none',
    width:'100%',
    background:'var(--lm-bg)',
    color:'var(--lm-text)',
    WebkitAppearance:'none',
  },
  btn:   {
    background:'var(--lm-secondary)',
    color:'var(--lm-primary)',
    border:'none',
    fontFamily:'sans-serif',
    fontSize:'1rem',
    fontWeight:700,
    padding:'0.85rem',
    borderRadius:8,
    cursor:'pointer',
    marginTop:'0.5rem',
    width:'100%',
    letterSpacing:'0.05em',
  },
  back:  {
    display:'inline-block',
    marginTop:'1.5rem',
    fontSize:'0.85rem',
    color:'var(--lm-muted)',
  },
};
