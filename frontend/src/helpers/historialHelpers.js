import {
    User, Mail, BookOpen, Activity, Award, GraduationCap, BarChart3
} from 'lucide-react';
import { parseCustomDate } from './dateFormatter.helper';

/**
 * Categoriza una acción basándose en su tipo
 * @param {string} tipoAccion - El texto de la acción
 * @returns {string} - La categoría de la acción
 */
export const getCategoryFromAction = (tipoAccion) => {
    const text = tipoAccion.toLowerCase();
    if (text.includes('subido') || text.includes('creado')) return 'upload';
    if (text.includes('descargado')) return 'download';
    if (text.includes('comentado') || text.includes('respondido')) return 'comment';
    if (text.includes('valorado')) return 'rating';
    if (text.includes('actualizado') && text.includes('académico')) return 'academic';
    if (text.includes('actualizado')) return 'profile';
    if (text.includes('encuesta')) return 'survey';
    return 'other';
};

/**
 * Retorna el estilo (icono, colores) para un tipo de acción
 * @param {string} category - La categoría de la acción
 * @returns {object} - Objeto con icon, color, bg, border
 */
export const getActionStyle = (category) => {
    switch (category) {
        case 'upload':
            return { icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' };
        case 'download':
            return { icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
        case 'comment':
            return { icon: Mail, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
        case 'rating':
            return { icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
        case 'academic':
            return { icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' };
        case 'profile':
            return { icon: User, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' };
        case 'survey':
            return { icon: BarChart3, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' };
        default:
            return { icon: Activity, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };
    }
};

/**
 * Formatea una fecha a tiempo relativo en español con hora
 * @param {string} dateString - Fecha en formato string
 * @returns {string} - Tiempo relativo formateado con hora
 */
export const formatRelativeTime = (dateString) => {
    const date = parseCustomDate(dateString);

    // Si la fecha es inválida, retornar un mensaje amigable
    if (!date || isNaN(date.getTime())) {
        return 'Fecha no disponible';
    }

    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Format hours and minutes for display
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    if (diffMins < 1) return 'Hace unos segundos';
    if (diffMins < 60) return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'} (${timeStr})`;
    if (diffDays < 7) return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'} a las ${timeStr}`;

    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Agrupa las acciones del historial por períodos de tiempo
 * @param {Array} acciones - Array de acciones del historial
 * @returns {object} - Objeto con acciones agrupadas por today, yesterday, lastWeek, earlier
 */
export const groupHistoryByPeriod = (acciones) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const groups = {
        today: [],
        yesterday: [],
        lastWeek: [],
        earlier: []
    };

    acciones.forEach(accion => {
        const actionDate = parseCustomDate(accion.fechaAccion);

        // Si la fecha es inválida, ponerla en "earlier"
        if (!actionDate || isNaN(actionDate.getTime())) {
            groups.earlier.push(accion);
            return;
        }

        const actionDay = new Date(actionDate.getFullYear(), actionDate.getMonth(), actionDate.getDate());

        if (actionDay.getTime() === today.getTime()) {
            groups.today.push(accion);
        } else if (actionDay.getTime() === yesterday.getTime()) {
            groups.yesterday.push(accion);
        } else if (actionDate >= lastWeek) {
            groups.lastWeek.push(accion);
        } else {
            groups.earlier.push(accion);
        }
    });

    return groups;
};

/**
 * Convierte mensajes de historial de perspectiva admin a perspectiva de usuario
 * @param {string} tipoAccion - El mensaje original de la acción
 * @returns {string} - El mensaje formateado en segunda persona
 */
export const formatActionForUser = (tipoAccion) => {
    if (!tipoAccion) return tipoAccion;

    // Use generic patterns that match any user name to handle historical inconsistencies
    const patterns = [
        { regex: /El usuario .+ ha subido el apunte (.+)\./i, replacement: 'Has subido el apunte $1' },
        { regex: /El usuario .+ ha descargado el apunte (.+)\./i, replacement: 'Has descargado el apunte $1' },
        { regex: /El usuario .+ ha comentado en el apunte (.+)\./i, replacement: 'Has comentado en el apunte $1' },
        { regex: /El usuario .+ ha respondido al comentario de (.+) en el apunte (.+)\./i, replacement: 'Has respondido al comentario de $1 en el apunte $2' },
        { regex: /El usuario .+ ha creado su perfil académico\./i, replacement: 'Has creado tu perfil académico' },
        { regex: /El usuario .+ ha actualizado su perfil\./i, replacement: 'Has actualizado tu perfil' },
        { regex: /El usuario .+ ha actualizado su perfil académico\./i, replacement: 'Has actualizado tu perfil académico' },
        { regex: /El usuario .+ ha valorado el apunte (.+)\./i, replacement: 'Has valorado el apunte $1' },
        { regex: /El usuario .+ ha creado la encuesta (.+)\./i, replacement: 'Has creado la encuesta $1' },
        { regex: /El usuario .+ ha actualizado la encuesta (.+)\./i, replacement: 'Has actualizado la encuesta $1' },
        { regex: /El usuario .+ ha eliminado la encuesta (.+)\./i, replacement: 'Has eliminado la encuesta $1' },
    ];

    for (const pattern of patterns) {
        if (pattern.regex.test(tipoAccion)) {
            return tipoAccion.replace(pattern.regex, pattern.replacement);
        }
    }

    // Fallback: generic replacement for any "El usuario X ha..." pattern
    const genericPattern = /El usuario .+ ha (.+)/i;
    if (genericPattern.test(tipoAccion)) {
        return tipoAccion.replace(genericPattern, 'Has $1');
    }

    return tipoAccion;
};
