/**
 * Helper para obtener el prefijo de ruta basado en el rol del usuario
 * @param {string} role - El rol del usuario (admin, docente, ayudante, estudiante)
 * @returns {string} - El prefijo de ruta correspondiente
 */
export function getRoleBasePath(role) {
    switch (role) {
        case 'admin':
            return '/admin';
        case 'docente':
            return '/docente';
        case 'ayudante':
            return '/ayudante';
        case 'estudiante':
        default:
            return '/estudiante';
    }
}
