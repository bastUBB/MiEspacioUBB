import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContextProvider';

export default function RoleBasedRedirect() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      switch (user.role) {
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        case 'docente':
          navigate('/docente', { replace: true });
          break;
        case 'ayudante':
          navigate('/ayudante', { replace: true });
          break;
        case 'estudiante':
          navigate('/estudiante', { replace: true });
          break;
        default:
          navigate('/unauthorized', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return null;
}
