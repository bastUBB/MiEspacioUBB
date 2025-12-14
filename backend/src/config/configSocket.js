import { Server } from 'socket.io';
import { FRONTEND_URL } from './configEnv.js';

let io;
const usuariosActivos = new Map();

export async function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: FRONTEND_URL,
            methods: ['GET', 'POST'],
            credentials: true
        },
        path: '/socket.io/',
        transports: ['websocket', 'polling'],
        pingTimeout: 60000,
        pingInterval: 25000
    });

    io.on('connection', (socket) => {
        // Evento: Usuario se registra al conectarse
        socket.on('user:register', (userData) => {
            try {
                usuariosActivos.set(socket.id, {
                    rut: userData.rut,
                    nombre: userData.nombre,
                    rol: userData.rol,
                    conectadoEn: new Date()
                });

                // Emitir a todos la cantidad actualizada
                io.emit('users:count', usuariosActivos.size);
            } catch (error) {
                console.error('Error al registrar usuario:', error);
            }
        });

        // Evento: Usuario se desconecta
        socket.on('disconnect', () => {
            usuariosActivos.delete(socket.id);
            io.emit('users:count', usuariosActivos.size);
        });
    });

    return io;
}

// Función para obtener el conteo actual (usado por el endpoint REST)
export function getActiveUsersCount() {
    return usuariosActivos.size;
}

// Función para obtener lista de usuarios activos (opcional, para admin)
export function getActiveUsersList() {
    return Array.from(usuariosActivos.values());
}

// Función para emitir evento a un usuario específico por RUT
export function emitToUser(rut, event, data) {
    if (!io) return;

    for (const [socketId, userData] of usuariosActivos.entries()) {
        if (userData.rut === rut) {
            io.to(socketId).emit(event, data);
        }
    }
}

export { io };
