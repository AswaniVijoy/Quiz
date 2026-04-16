import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';

export default function QuizSetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizSet, setQuizSet] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [setRes, allQRes] = await Promise.all([
      api.get(`/quiz-sets/${id}`),
      api.get('/quiz'),
    ]);
    setQuizSet(setRes.data);
    // Filter questions that belong to this set
    const ids: string[] = setRes.data.questionIds || [];
    const relevant = allQRes.data.filter((q: any) => ids.includes(q._id));
    setQuestions(relevant);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleRemoveQuestion = async (qid: string) => {
    if (!window.confirm('Remove this question from the set?')) return;
    await api.delete(`/quiz-sets/${id}/questions/${qid}`);
    setQuestions(questions.filter(q => q._id !== qid));
  };

  if (loading) return <Layout><div style={{ padding: '40px' }}>Loading...</div></Layout>;

  return (
    <Layout>
      <div style={s.page}>
        <button style={s.back} onClick={() => navigate('/quizsets')}>← Back to Quiz Sets</button>

        {/* Set header */}
        <div style={s.setHeader}>
          <div>
            <span style={s.cat}>{quizSet.category || 'General'}</span>
            <h1 style={s.title}>{quizSet.title}</h1>
            <p style={s.desc}>{quizSet.description || 'No description.'}</p>
          </div>
          <div style={s.headerActions}>
            <button style={s.editSetBtn} onClick={() => navigate(`/quizsets/edit/${id}`)}>
              Edit Set
            </button>
            <button style={s.addQBtn} onClick={() => navigate(`/quizsets/${id}/questions/new`)}>
              + Add Question
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div style={s.statsBar}>
          <div style={s.stat}><span style={s.statNum}>{questions.length}</span><span style={s.statLbl}>Questions</span></div>
          <div style={s.statDiv} />
          <div style={s.stat}><span style={s.statNum}>{quizSet.category || '—'}</span><span style={s.statLbl}>Category</span></div>
        </div>

        {/* Questions list */}
        <h2 style={s.sectionTitle}>Questions</h2>
        {questions.length === 0 ? (
          <div style={s.empty}>
            <p>No questions yet.</p>
            <button style={s.addQBtn} onClick={() => navigate(`/quizsets/${id}/questions/new`)}>
              + Add First Question
            </button>
          </div>
        ) : (
          <div style={s.list}>
            {questions.map((q, idx) => (
              <div key={q._id} style={s.qCard}>
                <div style={s.qLeft}>
                  <span style={s.qNum}>{idx + 1}</span>
                  <div style={s.qBody}>
                    <p style={s.qText}>{q.question}</p>
                    <div style={s.opts}>
                      {q.options?.map((opt: any) => (
                        <span key={opt.label} style={{
                          ...s.opt,
                          ...(opt.label === q.correctAnswer ? s.optCorrect : {}),
                        }}>
                          {opt.label}: {opt.text}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={s.qActions}>
                  <button style={s.editQBtn}
                    onClick={() => navigate(`/quizsets/${id}/questions/edit/${q._id}`)}>
                    Edit
                  </button>
                  <button style={s.removeBtn} onClick={() => handleRemoveQuestion(q._id)}>
                    Remove
                  </button>
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
  page: { padding: '40px 48px', maxWidth: '900px' },
  back: { background: 'none', border: 'none', color: '#556B2F', cursor: 'pointer', fontSize: '14px', marginBottom: '24px', padding: 0, fontFamily: "'Georgia', serif" },
  setHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', gap: '20px' },
  cat: {
    fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const,
    letterSpacing: '1px', color: '#6B8E23', background: '#f0f4e8',
    padding: '3px 10px', borderRadius: '20px', display: 'inline-block', marginBottom: '10px',
  },
  title: { fontSize: '30px', margin: '0 0 8px', color: '#2d3a1e', fontFamily: "'Georgia', serif" },
  desc: { color: '#7a8c5e', margin: 0, fontSize: '15px' },
  headerActions: { display: 'flex', gap: '10px', flexShrink: 0, alignItems: 'flex-start' },
  editSetBtn: {
    padding: '10px 20px', borderRadius: '8px', border: '1.5px solid #c8d5a8',
    background: 'white', cursor: 'pointer', fontSize: '14px', color: '#556B2F',
  },
  addQBtn: {
    padding: '10px 20px', borderRadius: '8px', border: 'none',
    background: '#556B2F', color: '#FFFAF0', cursor: 'pointer', fontSize: '14px',
    fontFamily: "'Georgia', serif",
  },
  statsBar: {
    display: 'flex', alignItems: 'center', gap: '24px',
    background: 'white', borderRadius: '10px', padding: '16px 24px',
    border: '1px solid #e8edda', marginBottom: '32px',
  },
  stat: { display: 'flex', alignItems: 'center', gap: '10px' },
  statNum: { fontSize: '22px', fontWeight: 700, color: '#2d3a1e' },
  statLbl: { fontSize: '13px', color: '#7a8c5e' },
  statDiv: { width: '1px', height: '32px', background: '#e8edda' },
  sectionTitle: { fontSize: '18px', color: '#2d3a1e', margin: '0 0 16px' },
  empty: { textAlign: 'center' as const, padding: '48px', color: '#7a8c5e', background: 'white', borderRadius: '12px', border: '1px solid #e8edda' },
  list: { display: 'flex', flexDirection: 'column' as const, gap: '12px' },
  qCard: {
    background: 'white', borderRadius: '10px', padding: '20px 24px',
    border: '1px solid #e8edda', display: 'flex',
    justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px',
  },
  qLeft: { display: 'flex', gap: '16px', flex: 1 },
  qNum: {
    width: '28px', height: '28px', borderRadius: '50%', background: '#f0f4e8',
    color: '#556B2F', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: 700, flexShrink: 0,
  },
  qBody: { flex: 1 },
  qText: { margin: '0 0 10px', color: '#2d3a1e', fontSize: '15px', lineHeight: 1.5 },
  opts: { display: 'flex', flexWrap: 'wrap' as const, gap: '6px' },
  opt: {
    fontSize: '12px', padding: '4px 10px', borderRadius: '6px',
    background: '#f8f9f5', color: '#556B2F', border: '1px solid #e8edda',
  },
  optCorrect: { background: '#d4edda', color: '#155724', border: '1px solid #b8dfc4', fontWeight: 700 },
  qActions: { display: 'flex', gap: '8px', flexShrink: 0 },
  editQBtn: {
    padding: '6px 14px', borderRadius: '6px', border: '1px solid #c8d5a8',
    background: 'white', cursor: 'pointer', fontSize: '12px', color: '#556B2F',
  },
  removeBtn: {
    padding: '6px 14px', borderRadius: '6px', border: 'none',
    background: '#fee2e2', cursor: 'pointer', fontSize: '12px', color: '#dc2626',
  },
};