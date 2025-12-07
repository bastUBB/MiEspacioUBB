import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { UserContext } from './userContextProvider';

const SocketContext = createContext();

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
            transports: ['websocket', 'polling'],
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        newSocket.on('connect', () => {
            console.log('🔌 Conectado a Socket.IO');
            newSocket.emit('user:register', {
                rut: user.rut,
                nombre: user.nombreCompleto,
                rol: user.rol
            });
        });

        newSocket.on('users:count', (count) => {
            setUsuariosActivos(count);
        });

        newSocket.on('connect_error', (error) => {
            console.error('❌ Error de conexión Socket.IO:', error);
        });

        newSocket.on('disconnect', () => {
            console.log('🔌 Desconectado de Socket.IO');
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
