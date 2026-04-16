import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.left}>
        <div style={s.leftInner}>
          <div style={s.logo}>◈ QuizForge</div>
          <h1 style={s.headline}>Admin Portal</h1>
          <p style={s.sub}>Manage your quizzes, questions, and categories from one place.</p>
        </div>
      </div>
      <div style={s.right}>
        <div style={s.card}>
          <h2 style={s.title}>Welcome back</h2>
          <p style={s.hint}>Sign in to your admin account</p>
          {error && <div style={s.errorBox}>{error}</div>}
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" placeholder="admin@quiz.com"
            value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
            onClick={handleLogin} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { display: 'flex', minHeight: '100vh', fontFamily: "'Georgia', serif" },
  left: {
    flex: 1, background: '#556B2F', display: 'flex',
    alignItems: 'center', justifyContent: 'center', padding: '60px',
  },
  leftInner: { maxWidth: '380px' },
  logo: { fontSize: '26px', color: '#FFDAB9', fontWeight: 700, marginBottom: '40px', letterSpacing: '1px' },
  headline: { fontSize: '42px', color: '#FFFAF0', margin: '0 0 16px', lineHeight: 1.2 },
  sub: { fontSize: '16px', color: 'rgba(255,250,240,0.7)', lineHeight: 1.7 },
  right: {
    width: '480px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '60px', background: '#FFFAF0',
  },
  card: { width: '100%', maxWidth: '360px' },
  title: { fontSize: '28px', margin: '0 0 6px', color: '#2d3a1e' },
  hint: { color: '#7a8c5e', fontSize: '14px', margin: '0 0 28px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#556B2F', marginBottom: '6px', marginTop: '16px' },
  input: {
    width: '100%', padding: '12px 14px', borderRadius: '8px',
    border: '1.5px solid #c8d5a8', fontSize: '15px', background: 'white',
    outline: 'none', boxSizing: 'border-box', color: '#2d3a1e',
    fontFamily: 'inherit',
  },
  btn: {
    width: '100%', marginTop: '28px', padding: '14px',
    background: '#556B2F', color: '#FFFAF0', border: 'none',
    borderRadius: '8px', fontSize: '16px', cursor: 'pointer',
    fontFamily: "'Georgia', serif", letterSpacing: '0.5px',
  },
  errorBox: {
    background: '#fee2e2', color: '#991b1b', padding: '10px 14px',
    borderRadius: '8px', fontSize: '14px', marginBottom: '8px',
  },
};