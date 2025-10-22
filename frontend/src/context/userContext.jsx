import axios from 'axios';
import { createContext, useState, useEffect } from 'react';

// Crear el contexto
const UserContext = createContext({
  user: null,
  setUser: () => {},
  loading: true,
  logout: () => {},
});

// Provider del contexto
export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios.get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(({ data }) => setUser(data))
        .catch((error) => {
          console.error('Error al cargar perfil:', error);
          if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
}
