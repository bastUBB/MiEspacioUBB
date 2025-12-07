import { Server } from 'socket.io';
import { FRONTEND_URL } from './configEnv.js';

let io;
const usuariosActivos = new Map();

export async function initializeSocket(server) {
    console.log('🔧 [Socket.IO] Iniciando configuración...');
    console.log('🔧 [Socket.IO] FRONTEND_URL configurado:', FRONTEND_URL);

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

    console.log('✅ [Socket.IO] Servidor inicializado correctamente');
    console.log('✅ [Socket.IO] Esperando conexiones en path: /socket.io/');

    // Manejo de errores a nivel del servidor
    io.engine.on('connection_error', (err) => {
        console.error('❌ [Socket.IO] Error de conexión del motor:', {
            message: err.message,
            code: err.code,
            context: err.context
        });
    });

    io.on('connection', (socket) => {
        console.log('✅ [Socket.IO] Usuario conectado:', socket.id);
        console.log('📍 [Socket.IO] Handshake:', {
            address: socket.handshake.address,
            headers: socket.handshake.headers.origin,
            secure: socket.handshake.secure,
            transport: socket.conn.transport.name
        });

        // Evento: Usuario se registra al conectarse
        socket.on('user:register', (userData) => {
            console.log('📝 [Socket.IO] Registrando usuario:', userData);

            try {
                usuariosActivos.set(socket.id, {
                    rut: userData.rut,
                    nombre: userData.nombre,
                    rol: userData.rol,
                    conectadoEn: new Date()
                });

                // Emitir a todos la cantidad actualizada
                io.emit('users:count', usuariosActivos.size);
                console.log(`👤 [Socket.IO] ${userData.nombre} registrado | Total activos: ${usuariosActivos.size}`);
            } catch (error) {
                console.error('❌ [Socket.IO] Error al registrar usuario:', error);
            }
        });

        // Manejo de errores del socket individual
        socket.on('error', (error) => {
            console.error('❌ [Socket.IO] Error en socket', socket.id, ':', error);
        });

        // Evento: Usuario se desconecta
        socket.on('disconnect', (reason) => {
            console.log(`🔌 [Socket.IO] Socket ${socket.id} desconectado. Razón: ${reason}`);

            const usuario = usuariosActivos.get(socket.id);
            usuariosActivos.delete(socket.id);
            io.emit('users:count', usuariosActivos.size);

            if (usuario) {
                console.log(`👋 [Socket.IO] ${usuario.nombre} desconectado | Total activos: ${usuariosActivos.size}`);
            }
        });
    });

    console.log('🎯 [Socket.IO] Listeners configurados correctamente');
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
