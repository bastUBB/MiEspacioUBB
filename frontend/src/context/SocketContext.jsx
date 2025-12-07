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
            console.log('⏸️ [Socket] No hay usuario, desconectando...');
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        console.log('🚀 [Socket] Usuario detectado, iniciando conexión...');
        console.log('👤 [Socket] Usuario:', { rut: user.rut, nombre: user.nombreCompleto, rol: user.rol });

        // En producción usa la variable de entorno VITE_SOCKET_URL si existe,
        // de lo contrario usa el origen de la ventana (para proxy) o localhost en desarrollo
        const socketUrl = import.meta.env.VITE_SOCKET_URL || (import.meta.env.PROD
            ? window.location.origin
            : 'http://localhost:5500');

        console.log('🔧 [Socket] Configuración de conexión:', {
            url: socketUrl,
            isProd: import.meta.env.PROD,
            envSocketUrl: import.meta.env.VITE_SOCKET_URL,
            windowOrigin: window.location.origin
        });

        const newSocket = io(socketUrl, {
            path: '/socket.io/',
            // transports: ['websocket', 'polling'], // Comentado para permitir polling por defecto (mejor compatibilidad)
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        console.log('📡 [Socket] Instancia de socket creada, esperando conexión...');

        newSocket.on('connect', () => {
            console.log('✅ [Socket] ¡Conectado exitosamente!');
            console.log('🔌 [Socket] ID de socket:', newSocket.id);
            console.log('🔌 [Socket] Transporte:', newSocket.io.engine.transport.name);

            const userData = {
                rut: user.rut,
                nombre: user.nombreCompleto,
                rol: user.rol
            };
            console.log('📤 [Socket] Emitiendo user:register con:', userData);
            newSocket.emit('user:register', userData);
        });

        newSocket.on('users:count', (count) => {
            console.log('📊 [Socket] Usuarios activos actualizados:', count);
            setUsuariosActivos(count);
        });

        newSocket.on('connect_error', (error) => {
            console.error('❌ [Socket] Error de conexión:', {
                message: error.message,
                description: error.description,
                context: error.context,
                type: error.type
            });
            console.error('❌ [Socket] Stack trace:', error.stack);
        });

        newSocket.on('disconnect', (reason) => {
            console.log('🔌 [Socket] Desconectado. Razón:', reason);
        });

        newSocket.on('reconnect_attempt', (attemptNumber) => {
            console.log('🔄 [Socket] Intento de reconexión #', attemptNumber);
        });

        newSocket.on('reconnect_failed', () => {
            console.error('❌ [Socket] Falló la reconexión después de todos los intentos');
        });

        newSocket.io.on('error', (error) => {
            console.error('❌ [Socket] Error del administrador de conexión:', error);
        });

        setSocket(newSocket);

        return () => {
            console.log('🧹 [Socket] Limpiando conexión...');
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
