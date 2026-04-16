import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import QuizSetList from './pages/QuizSetList';
import QuizSetForm from './pages/QuizSetForm';
import QuizSetDetail from './pages/QuizSetDetail';
import QuestionForm from './pages/QuestionForm';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/quizsets" element={<ProtectedRoute><QuizSetList /></ProtectedRoute>} />
        <Route path="/quizsets/new" element={<ProtectedRoute><QuizSetForm /></ProtectedRoute>} />
        <Route path="/quizsets/edit/:id" element={<ProtectedRoute><QuizSetForm /></ProtectedRoute>} />
        <Route path="/quizsets/:id" element={<ProtectedRoute><QuizSetDetail /></ProtectedRoute>} />
        <Route path="/quizsets/:setId/questions/new" element={<ProtectedRoute><QuestionForm /></ProtectedRoute>} />
        <Route path="/quizsets/:setId/questions/edit/:qid" element={<ProtectedRoute><QuestionForm /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}