import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const token = localStorage.getItem('token');

  // If no token found, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}