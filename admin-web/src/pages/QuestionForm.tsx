import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';

export default function QuestionForm() {
  const navigate = useNavigate();
  const { setId, qid } = useParams();
  const isEditing = Boolean(qid);

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([
    { label: 'A', text: '' }, { label: 'B', text: '' },
    { label: 'C', text: '' }, { label: 'D', text: '' },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState('A');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      api.get(`/quiz/${qid}`).then(res => {
        setQuestion(res.data.question);
        setOptions(res.data.options);
        setCorrectAnswer(res.data.correctAnswer);
      });
    }
  }, [qid]);

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index].text = value;
    setOptions(updated);
  };

  const handleSubmit = async () => {
    if (!question.trim()) { alert('Question text is required'); return; }
    if (options.some(o => !o.text.trim())) { alert('Please fill in all 4 options'); return; }
    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/quiz/${qid}`, { question, options, correctAnswer });
      } else {
        // Create question then add to quiz set
        const res = await api.post('/quiz', { question, options, correctAnswer });
        await api.post(`/quiz-sets/${setId}/questions/${res.data._id}`);
      }
      navigate(`/quizsets/${setId}`);
    } catch { alert('Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <Layout>
      <div style={s.page}>
        <button style={s.back} onClick={() => navigate(`/quizsets/${setId}`)}>← Back to Quiz Set</button>
        <h1 style={s.title}>{isEditing ? 'Edit Question' : 'Add New Question'}</h1>
        <div style={s.card}>
          <label style={s.label}>Question Text *</label>
          <textarea style={s.textarea} rows={3}
            placeholder="Type your question here..."
            value={question} onChange={e => setQuestion(e.target.value)} />

          <label style={s.label}>Answer Options *</label>
          <div style={s.optsGrid}>
            {options.map((opt, idx) => (
              <div key={opt.label} style={s.optRow}>
                <span style={{
                  ...s.optBadge,
                  ...(opt.label === correctAnswer ? s.optBadgeCorrect : {}),
                }}>{opt.label}</span>
                <input style={s.optInput}
                  placeholder={`Option ${opt.label}`}
                  value={opt.text}
                  onChange={e => handleOptionChange(idx, e.target.value)} />
              </div>
            ))}
          </div>

          <label style={s.label}>Correct Answer *</label>
          <div style={s.answerRow}>
            {options.map(opt => (
              <button key={opt.label}
                style={{ ...s.ansBtn, ...(correctAnswer === opt.label ? s.ansBtnActive : {}) }}
                onClick={() => setCorrectAnswer(opt.label)}>
                {opt.label}
              </button>
            ))}
          </div>
          <p style={s.hint}>Selected: Option {correctAnswer} — "{options.find(o => o.label === correctAnswer)?.text || '...'}"</p>

          <div style={s.btns}>
            <button style={s.cancelBtn} onClick={() => navigate(`/quizsets/${setId}`)}>Cancel</button>
            <button style={s.saveBtn} onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Question'}
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
  label: { fontSize: '13px', fontWeight: 700, color: '#556B2F', marginTop: '16px' },
  textarea: {
    padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #c8d5a8',
    fontSize: '15px', outline: 'none', fontFamily: 'inherit', resize: 'vertical' as const, color: '#2d3a1e',
  },
  optsGrid: { display: 'flex', flexDirection: 'column' as const, gap: '10px', marginTop: '4px' },
  optRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  optBadge: {
    width: '32px', height: '32px', borderRadius: '50%', background: '#f0f4e8',
    color: '#556B2F', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: '13px', flexShrink: 0, border: '2px solid #c8d5a8',
  },
  optBadgeCorrect: { background: '#556B2F', color: 'white', border: '2px solid #556B2F' },
  optInput: {
    flex: 1, padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #c8d5a8',
    fontSize: '15px', outline: 'none', fontFamily: 'inherit', color: '#2d3a1e',
  },
  answerRow: { display: 'flex', gap: '10px', marginTop: '8px' },
  ansBtn: {
    width: '48px', height: '48px', borderRadius: '10px', border: '2px solid #c8d5a8',
    background: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: 700,
    color: '#7a8c5e',
  },
  ansBtnActive: { background: '#556B2F', color: 'white', border: '2px solid #556B2F' },
  hint: { fontSize: '13px', color: '#9aab7a', margin: '4px 0 0' },
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