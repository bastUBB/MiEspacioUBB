import { createContext, useContext, useState, useEffect } from 'react';
import { UserContext } from './userContextProvider';
import { SocketContext } from './SocketContext';
import { obtenerTodasMisNotificacionesService, actualizarEstadoLeidoService, borrarNotificacionesLeidasService } from '../services/notificacion.service';
import { toast } from 'react-hot-toast';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const { user } = useContext(UserContext);
    const { socket } = useContext(SocketContext);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Cargar notificaciones iniciales
    const fetchNotifications = async () => {
        if (!user?.rut) return;
        try {
            const response = await obtenerTodasMisNotificacionesService(user.rut);
            if (response.status === 'Success') {
                const sorted = response.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                setNotifications(sorted);
                setUnreadCount(sorted.filter(n => !n.estadoLeido).length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [user]);

    // Escuchar notificaciones por socket
    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (notification) => {
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Toast personalizado sin emojis feos, más limpio
            toast(notification.mensaje, {
                icon: '🔔',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                duration: 4000
            });
        };

        // Registrar listeners
        socket.on('notification:new', handleNewNotification);

        return () => {
            socket.off('notification:new', handleNewNotification);
        };
    }, [socket]);

    const markAsRead = async (id) => {
        try {
            // Optimistic update
            setNotifications(prev => prev.map(n =>
                n._id === id ? { ...n, estadoLeido: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));

            await actualizarEstadoLeidoService(id);
        } catch (error) {
            console.error('Error marking as read:', error);
            fetchNotifications(); // Revert on error
        }
    };

    const clearAll = async () => {
        try {
            setNotifications([]);
            setUnreadCount(0);
            await borrarNotificacionesLeidasService(user.rut);
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            clearAll,
            fetchNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export { NotificationContext };
