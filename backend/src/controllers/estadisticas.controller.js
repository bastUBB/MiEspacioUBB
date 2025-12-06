import {
    obtenerTotalApuntesActivosService,
    obtenerTotalUsuariosService,
    obtenerUsuariosActivosService,
    obtenerDescargasTotalesService,
    obtenerDistribucionTiposService,
    obtenerTop5AsignaturasService,
    obtenerAsignaturasMejorValoradasService,
    obtenerApuntesPopularesSemanaService,
    obtenerTopContribuidoresSemanaService,
    obtenerValoracionPromedioSistemaService,
    obtenerContenidoPorSemestreService,
    obtenerDescargasService,
    obtenerApuntesMasComentadosService,
    obtenerCrecimientoMensualService,
    obtenerApunteMasDescargadoService,
    obtenerDiaMasSemanaActivoService
} from '../services/estadisticas.service.js';
import { handleErrorServer, handleSuccess } from '../handlers/responseHandlers.js';

// 1. Total de Apuntes Activos
export async function obtenerTotalApuntesActivos(req, res) {
    try {
        const [data, error] = await obtenerTotalApuntesActivosService();
        if (error) return handleErrorServer(res, 500, error);
        return handleSuccess(res, 200, 'Total obtenido exitosamente', data);
    } catch (error) {
        console.error('Error en obtenerTotalApuntesActivos:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

// 2. Total de Usuarios Registrados
export async function obtenerTotalUsuarios(req, res) {
    try {
        const [data, error] = await obtenerTotalUsuariosService();
        if (error) return handleErrorServer(res, 500, error);
        return handleSuccess(res, 200, 'Total obtenido exitosamente', data);
    } catch (error) {
        console.error('Error en obtenerTotalUsuarios:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

// 3. Usuarios Activos (Real-time con Socket.IO)
export async function obtenerUsuariosActivos(req, res) {
    try {
        const [data, error] = await obtenerUsuariosActivosService();
        if (error) return handleErrorServer(res, 500, error);
        return handleSuccess(res, 200, 'Total obtenido exitosamente', data);
    } catch (error) {
        console.error('Error en obtenerUsuariosActivos:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

// 4. Descargas Totales del Sistema
export async function obtenerDescargasTotales(req, res) {
    try {
        const [data, error] = await obtenerDescargasTotalesService();
        if (error) return handleErrorServer(res, 500, error);
        return handleSuccess(res, 200, 'Total obtenido exitosamente', data);
    } catch (error) {
        console.error('Error en obtenerDescargasTotales:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

// 5. Distribución por Tipos
export async function obtenerDistribucionTipos(req, res) {
    try {
        const [data, error] = await obtenerDistribucionTiposService();
        if (error) return handleErrorServer(res, 500, error);
        return handleSuccess(res, 200, 'Distribución obtenida exitosamente', data);
    } catch (error) {
        console.error('Error en obtenerDistribucionTipos:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

// 6. Top 5 Asignaturas
export async function obtenerTop5Asignaturas(req, res) {
    try {
        const [data, error] = await obtenerTop5AsignaturasService();
        if (error) return handleErrorServer(res, 500, error);
        return handleSuccess(res, 200, 'Top 5 obtenido exitosamente', data);
    } catch (error) {
        console.error('Error en obtenerTop5Asignaturas:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

// 7. Asignaturas Mejor Valoradas
export async function obtenerAsignaturasMejorValoradas(req, res) {
    try {
        const [data, error] = await obtenerAsignaturasMejorValoradasService();
        if (error) return handleErrorServer(res, 500, error);
        return handleSuccess(res, 200, 'Asignaturas mejor valoradas obtenidas', data);
    } catch (error) {
        console.error('Error en obtenerAsignaturasMejorValoradas:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

// 11. Apuntes Populares de la Semana
export async function obtenerApuntesPopularesSemana(req, res) {
    try {
        const [data, error] = await obtenerApuntesPopularesSemanaService();
        if (error) return handleErrorServer(res, 500, error);
        return handleSuccess(res, 200, 'Apuntes populares obtenidos', data);
    } catch (error) {
        console.error('Error en obtenerApuntesPopularesSemana:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

// 12. Top Contribuidores de la Semana
export async function obtenerTopContribuidoresSemana(req, res) {
    try {
        const [data, error] = await obtenerTopContribuidoresSemanaService();
        if (error) return handleErrorServer(res, 500, error);
        return handleSuccess(res, 200, 'Top contribuidores obtenidos', data);
    } catch (error) {
        console.error('Error en obtenerTopContribuidoresSemana:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

// 13. Valoración Promedio del Sistema
export async function obtenerValoracionPromedioSistema(req, res) {
    try {
        const [data, error] = await obtenerValoracionPromedioSistemaService();
        if (error) return handleErrorServer(res, 500, error);
        return handleSuccess(res, 200, 'Valoración promedio obtenida', data);
    } catch (error) {
        console.error('Error en obtenerValoracionPromedioSistema:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

// 18. Contenido por Semestre
export async function obtenerContenidoPorSemestre(req, res) {
    try {
        const [data, error] = await obtenerContenidoPorSemestreService();
        if (error) return handleErrorServer(res, 500, error);
        return handleSuccess(res, 200, 'Contenido por semestre obtenido', data);
    } catch (error) {
        console.error('Error en obtenerContenidoPorSemestre:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

// 19. Descargas de la Semana
export async function obtenerDescargas(req, res) {
    try {
        const [data, error] = await obtenerDescargasService();
        if (error) return handleErrorServer(res, 500, error);
        return handleSuccess(res, 200, 'Descargas obtenidas', data);
    } catch (error) {
        console.error('Error en obtenerDescargas:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

// 21. Apuntes Más Comentados
export async function obtenerApuntesMasComentados(req, res) {
    try {
        const [data, error] = await obtenerApuntesMasComentadosService();
        if (error) return handleErrorServer(res, 500, error);
        return handleSuccess(res, 200, 'Apuntes más comentados obtenidos', data);
    } catch (error) {
        console.error('Error en obtenerApuntesMasComentados:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

// 22. Crecimiento Mensual
export async function obtenerCrecimientoMensual(req, res) {
    try {
        const [data, error] = await obtenerCrecimientoMensualService();
        if (error) return handleErrorServer(res, 500, error);
        return handleSuccess(res, 200, 'Crecimiento mensual obtenido', data);
    } catch (error) {
        console.error('Error en obtenerCrecimientoMensual:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

// 23. Apunte Más Descargado
export async function obtenerApunteMasDescargado(req, res) {
    try {
        const [data, error] = await obtenerApunteMasDescargadoService();
        if (error) return handleErrorServer(res, 500, error);
        return handleSuccess(res, 200, 'Apunte más descargado obtenido', data);
    } catch (error) {
        console.error('Error en obtenerApunteMasDescargado:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

// 24. Día Más Activo de la Semana
export async function obtenerDiaMasSemanaActivo(req, res) {
    try {
        const [data, error] = await obtenerDiaMasSemanaActivoService();
        if (error) return handleErrorServer(res, 500, error);
        return handleSuccess(res, 200, 'Día más activo obtenido', data);
    } catch (error) {
        console.error('Error en obtenerDiaMasSemanaActivo:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}
