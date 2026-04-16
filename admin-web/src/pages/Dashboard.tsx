import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSets: 0, totalQuestions: 0, totalCategories: 0,
  });
  const [recentSets, setRecentSets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/quiz-sets'), api.get('/quiz')]).then(([setsRes, questionsRes]) => {
      const sets = setsRes.data;
      const questions = questionsRes.data;
      const categories = new Set(sets.map((s: any) => s.category).filter(Boolean));
      setStats({
        totalSets: sets.length,
        totalQuestions: questions.length,
        totalCategories: categories.size,
      });
      setRecentSets(sets.slice(-4).reverse());
    }).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Quiz Sets', value: stats.totalSets, icon: '❑', color: '#556B2F' },
    { label: 'Total Questions', value: stats.totalQuestions, icon: '?', color: '#6B8E23' },
    { label: 'Categories', value: stats.totalCategories, icon: '◈', color: '#CD853F' },
  ];

  return (
    <Layout>
      <div style={s.page}>
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Dashboard</h1>
            <p style={s.subtitle}>Overview of your quiz content</p>
          </div>
          <button style={s.cta} onClick={() => navigate('/quizsets/new')}>
            + New Quiz Set
          </button>
        </div>

        {/* Stat cards */}
        <div style={s.statsRow}>
          {statCards.map(card => (
            <div key={card.label} style={s.statCard}>
              <div style={{ ...s.statIcon, background: card.color }}>{card.icon}</div>
              <div>
                <div style={s.statValue}>{loading ? '—' : card.value}</div>
                <div style={s.statLabel}>{card.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent quiz sets */}
        <div style={s.section}>
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>Recent Quiz Sets</h2>
            <button style={s.linkBtn} onClick={() => navigate('/quizsets')}>View all →</button>
          </div>
          <div style={s.grid}>
            {recentSets.length === 0 && !loading && (
              <p style={{ color: '#7a8c5e', gridColumn: '1/-1' }}>No quiz sets yet. Create your first one!</p>
            )}
            {recentSets.map((set: any) => (
              <div key={set._id} style={s.quizCard} onClick={() => navigate(`/quizsets/${set._id}`)}>
                <div style={s.quizCardTop}>
                  <span style={s.quizCategory}>{set.category || 'General'}</span>
                </div>
                <h3 style={s.quizTitle}>{set.title}</h3>
                <p style={s.quizDesc}>{set.description || 'No description'}</p>
                <div style={s.quizMeta}>
                  <span>{set.questionIds?.length || 0} questions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { padding: '40px 48px', maxWidth: '1100px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px' },
  title: { fontSize: '32px', margin: 0, color: '#2d3a1e', fontFamily: "'Georgia', serif" },
  subtitle: { color: '#7a8c5e', margin: '4px 0 0', fontSize: '15px' },
  cta: {
    padding: '12px 24px', background: '#556B2F', color: '#FFFAF0',
    border: 'none', borderRadius: '8px', cursor: 'pointer',
    fontSize: '14px', fontFamily: "'Georgia', serif",
  },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' },
  statCard: {
    background: 'white', borderRadius: '12px', padding: '24px',
    display: 'flex', alignItems: 'center', gap: '20px',
    border: '1px solid #e8edda', boxShadow: '0 2px 8px rgba(85,107,47,0.07)',
  },
  statIcon: {
    width: '52px', height: '52px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '22px', color: 'white', flexShrink: 0,
  },
  statValue: { fontSize: '32px', fontWeight: 700, color: '#2d3a1e', lineHeight: 1 },
  statLabel: { fontSize: '13px', color: '#7a8c5e', marginTop: '4px' },
  section: { marginBottom: '40px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  sectionTitle: { fontSize: '20px', margin: 0, color: '#2d3a1e' },
  linkBtn: { background: 'none', border: 'none', color: '#556B2F', cursor: 'pointer', fontSize: '14px', fontFamily: "'Georgia', serif" },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' },
  quizCard: {
    background: 'white', borderRadius: '12px', padding: '24px',
    border: '1px solid #e8edda', cursor: 'pointer',
    transition: 'box-shadow 0.2s, transform 0.2s',
    boxShadow: '0 2px 8px rgba(85,107,47,0.07)',
  },
  quizCardTop: { marginBottom: '10px' },
  quizCategory: {
    fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const,
    letterSpacing: '1px', color: '#6B8E23', background: '#f0f4e8',
    padding: '3px 10px', borderRadius: '20px',
  },
  quizTitle: { fontSize: '17px', margin: '0 0 8px', color: '#2d3a1e' },
  quizDesc: { fontSize: '13px', color: '#7a8c5e', margin: '0 0 16px', lineHeight: 1.5 },
  quizMeta: { fontSize: '12px', color: '#9aab7a', borderTop: '1px solid #f0f4e8', paddingTop: '12px' },
};