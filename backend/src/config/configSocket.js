import { Server } from 'socket.io';
import { FRONTEND_URL } from './configEnv.js';

let io;
const usuariosActivos = new Map();

export function initializeSocket(server) {
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
        console.log('✅ Usuario conectado:', socket.id);

        // Evento: Usuario se registra al conectarse
        socket.on('user:register', (userData) => {
            usuariosActivos.set(socket.id, {
                rut: userData.rut,
                nombre: userData.nombre,
                rol: userData.rol,
                conectadoEn: new Date()
            });

            // Emitir a todos la cantidad actualizada
            io.emit('users:count', usuariosActivos.size);
            console.log(`👤 ${userData.nombre} conectado | Total activos: ${usuariosActivos.size}`);
        });

        // Evento: Usuario se desconecta
        socket.on('disconnect', () => {
            const usuario = usuariosActivos.get(socket.id);
            usuariosActivos.delete(socket.id);
            io.emit('users:count', usuariosActivos.size);
            if (usuario) {
                console.log(`👋 ${usuario.nombre} desconectado | Total activos: ${usuariosActivos.size}`);
            }
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

export { io };
