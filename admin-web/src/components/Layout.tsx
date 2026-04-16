import { useNavigate, useLocation } from 'react-router-dom';

interface Props { children: React.ReactNode; }

export default function Layout({ children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '▦' },
    { label: 'Quiz Sets', path: '/quizsets', icon: '❑' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={s.shell}>
      <aside style={s.sidebar}>
        <div style={s.brand}>
          <span style={s.brandIcon}>◈</span>
          <span style={s.brandText}>QuizForge</span>
        </div>
        <nav style={s.nav}>
          {navItems.map(item => (
            <button
              key={item.path}
              style={{
                ...s.navItem,
                ...(location.pathname.startsWith(item.path) ? s.navItemActive : {}),
              }}
              onClick={() => navigate(item.path)}
            >
              <span style={s.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <button style={s.logoutBtn} onClick={handleLogout}>
          <span>↩</span> Logout
        </button>
      </aside>
      <main style={s.main}>{children}</main>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  shell: { display: 'flex', minHeight: '100vh', background: '#FFFAF0', fontFamily: "'Georgia', serif" },
  sidebar: {
    width: '220px', background: '#556B2F', display: 'flex',
    flexDirection: 'column', padding: '0', position: 'sticky',
    top: 0, height: '100vh', flexShrink: 0,
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '28px 24px 24px', borderBottom: '1px solid rgba(255,250,240,0.15)',
  },
  brandIcon: { fontSize: '22px', color: '#FFDAB9' },
  brandText: { fontSize: '20px', fontWeight: 700, color: '#FFFAF0', letterSpacing: '0.5px' },
  nav: { flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '4px' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '11px 14px', borderRadius: '8px', border: 'none',
    background: 'transparent', color: 'rgba(255,250,240,0.75)',
    cursor: 'pointer', fontSize: '14px', textAlign: 'left', width: '100%',
    transition: 'all 0.15s',
  },
  navItemActive: { background: 'rgba(255,250,240,0.15)', color: '#FFFAF0', fontWeight: 600 },
  navIcon: { fontSize: '16px', width: '20px', textAlign: 'center' },
  logoutBtn: {
    margin: '12px', padding: '11px 14px', borderRadius: '8px',
    border: '1px solid rgba(255,250,240,0.2)', background: 'transparent',
    color: 'rgba(255,250,240,0.6)', cursor: 'pointer', fontSize: '14px',
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  main: { flex: 1, overflowY: 'auto' },
};