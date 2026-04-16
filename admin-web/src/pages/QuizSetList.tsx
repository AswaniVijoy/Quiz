import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';

export default function QuizSetList() {
  const navigate = useNavigate();
  const [sets, setSets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/quiz-sets').then(res => setSets(res.data)).finally(() => setLoading(false));
  }, []);

  const filtered = sets.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    (s.category || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this quiz set?')) return;
    await api.delete(`/quiz-sets/${id}`);
    setSets(sets.filter(s => s._id !== id));
  };

  return (
    <Layout>
      <div style={s.page}>
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Quiz Sets</h1>
            <p style={s.subtitle}>{sets.length} quiz sets total</p>
          </div>
          <button style={s.cta} onClick={() => navigate('/quizsets/new')}>+ New Quiz Set</button>
        </div>

        <input style={s.search} placeholder="Search quiz sets or categories..."
          value={search} onChange={e => setSearch(e.target.value)} />

        {loading ? <p style={{ color: '#7a8c5e' }}>Loading...</p> : (
          <div style={s.grid}>
            {filtered.length === 0 && <p style={{ color: '#7a8c5e', gridColumn: '1/-1' }}>No quiz sets found.</p>}
            {filtered.map(set => (
              <div key={set._id} style={s.card} onClick={() => navigate(`/quizsets/${set._id}`)}>
                <div style={s.cardTop}>
                  <span style={s.cat}>{set.category || 'General'}</span>
                  <div style={s.actions} onClick={e => e.stopPropagation()}>
                    <button style={s.editBtn} onClick={() => navigate(`/quizsets/edit/${set._id}`)}>Edit</button>
                    <button style={s.delBtn} onClick={e => handleDelete(set._id, e)}>Delete</button>
                  </div>
                </div>
                <h3 style={s.cardTitle}>{set.title}</h3>
                <p style={s.cardDesc}>{set.description || 'No description provided.'}</p>
                <div style={s.cardFoot}>
                  <span style={s.qCount}>📋 {set.questionIds?.length || 0} questions</span>
                  <span style={s.viewLink}>View & manage →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { padding: '40px 48px', maxWidth: '1100px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' },
  title: { fontSize: '32px', margin: 0, color: '#2d3a1e', fontFamily: "'Georgia', serif" },
  subtitle: { color: '#7a8c5e', margin: '4px 0 0', fontSize: '15px' },
  cta: {
    padding: '12px 24px', background: '#556B2F', color: '#FFFAF0',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
    fontFamily: "'Georgia', serif",
  },
  search: {
    width: '100%', maxWidth: '400px', padding: '11px 16px',
    borderRadius: '8px', border: '1.5px solid #c8d5a8',
    fontSize: '14px', marginBottom: '28px', outline: 'none',
    background: 'white', boxSizing: 'border-box' as const,
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  card: {
    background: 'white', borderRadius: '12px', padding: '24px',
    border: '1px solid #e8edda', cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(85,107,47,0.07)',
    display: 'flex', flexDirection: 'column', gap: '8px',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cat: {
    fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const,
    letterSpacing: '1px', color: '#6B8E23', background: '#f0f4e8',
    padding: '3px 10px', borderRadius: '20px',
  },
  actions: { display: 'flex', gap: '6px' },
  editBtn: {
    padding: '5px 12px', borderRadius: '6px', border: '1px solid #c8d5a8',
    background: 'white', cursor: 'pointer', fontSize: '12px', color: '#556B2F',
  },
  delBtn: {
    padding: '5px 12px', borderRadius: '6px', border: 'none',
    background: '#fee2e2', cursor: 'pointer', fontSize: '12px', color: '#dc2626',
  },
  cardTitle: { fontSize: '17px', margin: 0, color: '#2d3a1e' },
  cardDesc: { fontSize: '13px', color: '#7a8c5e', margin: 0, lineHeight: 1.5, flex: 1 },
  cardFoot: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    borderTop: '1px solid #f0f4e8', paddingTop: '12px', marginTop: '4px',
  },
  qCount: { fontSize: '12px', color: '#9aab7a' },
  viewLink: { fontSize: '12px', color: '#556B2F', fontWeight: 600 },
};