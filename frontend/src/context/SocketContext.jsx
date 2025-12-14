import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { UserContext } from './userContextProvider';

export const SocketContext = createContext();

export function SocketProvider({ children }) {
    const { user } = useContext(UserContext);
    const [socket, setSocket] = useState(null);
    const [usuariosActivos, setUsuariosActivos] = useState(0);

    useEffect(() => {
        if (!user) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        // En producción usa la variable de entorno VITE_SOCKET_URL si existe,
        // de lo contrario usa el origen de la ventana (para proxy) o localhost en desarrollo
        const socketUrl = import.meta.env.VITE_SOCKET_URL || (import.meta.env.PROD
            ? window.location.origin
            : 'http://localhost:5500');

        const newSocket = io(socketUrl, {
            path: '/socket.io/',
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        newSocket.on('connect', () => {
            const userData = {
                rut: user.rut,
                nombre: user.nombreCompleto,
                rol: user.rol
            };
            newSocket.emit('user:register', userData);
        });

        newSocket.on('users:count', (count) => {
            setUsuariosActivos(count);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, usuariosActivos }}>
            {children}
        </SocketContext.Provider>
    );
}

/* eslint-disable react-refresh/only-export-components */
export function useSocket() {
    return useContext(SocketContext);
}
