import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';

export default function QuizSetForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      api.get(`/quiz-sets/${id}`).then(res => {
        setTitle(res.data.title);
        setDescription(res.data.description);
        setCategory(res.data.category);
      });
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!title.trim()) { alert('Title is required'); return; }
    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/quiz-sets/${id}`, { title, description, category });
      } else {
        await api.post('/quiz-sets', { title, description, category });
      }
      navigate('/quizsets');
    } catch { alert('Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <Layout>
      <div style={s.page}>
        <button style={s.back} onClick={() => navigate('/quizsets')}>← Back to Quiz Sets</button>
        <h1 style={s.title}>{isEditing ? 'Edit Quiz Set' : 'Create New Quiz Set'}</h1>
        <div style={s.card}>
          <label style={s.label}>Quiz Set Title *</label>
          <input style={s.input} placeholder="e.g. General Knowledge"
            value={title} onChange={e => setTitle(e.target.value)} />

          <label style={s.label}>Category</label>
          <input style={s.input} placeholder="e.g. Science, Geography, History"
            value={category} onChange={e => setCategory(e.target.value)} />

          <label style={s.label}>Description</label>
          <textarea style={s.textarea} rows={4}
            placeholder="Describe what this quiz is about..."
            value={description} onChange={e => setDescription(e.target.value)} />

          <div style={s.btns}>
            <button style={s.cancelBtn} onClick={() => navigate('/quizsets')}>Cancel</button>
            <button style={s.saveBtn} onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Quiz Set'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { padding: '40px 48px', maxWidth: '680px' },
  back: { background: 'none', border: 'none', color: '#556B2F', cursor: 'pointer', fontSize: '14px', marginBottom: '20px', padding: 0, fontFamily: "'Georgia', serif" },
  title: { fontSize: '28px', color: '#2d3a1e', margin: '0 0 28px', fontFamily: "'Georgia', serif" },
  card: {
    background: 'white', borderRadius: '12px', padding: '32px',
    border: '1px solid #e8edda', display: 'flex', flexDirection: 'column', gap: '6px',
  },
  label: { fontSize: '13px', fontWeight: 700, color: '#556B2F', marginTop: '14px' },
  input: {
    padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #c8d5a8',
    fontSize: '15px', outline: 'none', fontFamily: 'inherit', color: '#2d3a1e',
  },
  textarea: {
    padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #c8d5a8',
    fontSize: '15px', outline: 'none', fontFamily: 'inherit', resize: 'vertical' as const, color: '#2d3a1e',
  },
  btns: { display: 'flex', gap: '12px', marginTop: '24px' },
  cancelBtn: {
    flex: 1, padding: '12px', borderRadius: '8px', border: '1.5px solid #c8d5a8',
    background: 'white', cursor: 'pointer', fontSize: '15px', fontFamily: "'Georgia', serif",
  },
  saveBtn: {
    flex: 2, padding: '12px', borderRadius: '8px', border: 'none',
    background: '#556B2F', color: '#FFFAF0', cursor: 'pointer',
    fontSize: '15px', fontFamily: "'Georgia', serif",
  },
};