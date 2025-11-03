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
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      try {
        // Primero intentar usar los datos del localStorage
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Luego verificar en segundo plano con el servidor
        axios.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(({ data }) => {
            // El backend devuelve la respuesta en data.data
            const userData = data.data || data;
            setUser(userData);
          })
          .catch((error) => {
            if (error.response?.status === 401 || error.response?.status === 403) {
              // Solo limpiar si realmente hay problema con el token
              localStorage.removeItem('token');
              localStorage.removeItem('userData');
              setUser(null);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (parseError) {
        console.error('Error al parsear userData:', parseError);
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setUser(null);
        setLoading(false);
      }
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

// Exportar el contexto para poder usarlo con useContext
export { UserContext };
