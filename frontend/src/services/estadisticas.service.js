import axios from 'axios';


// Hero Metrics
export async function obtenerTotalApuntesActivosService() {
    try {
        const response = await axios.get(`/api/estadisticas/total-apuntes`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error al obtener total de apuntes:', error);
        return { status: 'Error', message: error.response?.data?.message || 'Error al obtener datos' };
    }
};

export async function obtenerTotalUsuariosService() {
    try {
        const response = await axios.get(`/api/estadisticas/total-usuarios`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error al obtener total de usuarios:', error);
        return { status: 'Error', message: error.response?.data?.message || 'Error al obtener datos' };
    }
};

export async function obtenerUsuariosActivosService() {
    try {
        const response = await axios.get(`/api/estadisticas/usuarios-activos`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error al obtener usuarios activos:', error);
        return { status: 'Error', message: error.response?.data?.message || 'Error al obtener datos' };
    }
};

export async function obtenerDescargasTotalesService() {
    try {
        const response = await axios.get(`/api/estadisticas/descargas-totales`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error al obtener descargas totales:', error);
        return { status: 'Error', message: error.response?.data?.message || 'Error al obtener datos' };
    }
};

// Distribuciones
export async function obtenerDistribucionTiposService() {
    try {
        const response = await axios.get(`/api/estadisticas/distribucion-tipos`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error al obtener distribución de tipos:', error);
        return { status: 'Error', message: error.response?.data?.message || 'Error al obtener datos' };
    }
};

export async function obtenerTop5AsignaturasService() {
    try {
        const response = await axios.get(`/api/estadisticas/top-asignaturas`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error al obtener top asignaturas:', error);
        return { status: 'Error', message: error.response?.data?.message || 'Error al obtener datos' };
    }
};

export async function obtenerAsignaturasMejorValoradasService() {
    try {
        const response = await axios.get(`/api/estadisticas/asignaturas-mejor-valoradas`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error al obtener asignaturas mejor valoradas:', error);
        return { status: 'Error', message: error.response?.data?.message || 'Error al obtener datos' };
    }
};

export async function obtenerContenidoPorSemestreService() {
    try {
        const response = await axios.get(`/api/estadisticas/contenido-por-semestre`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error al obtener contenido por semestre:', error);
        return { status: 'Error', message: error.response?.data?.message || 'Error al obtener datos' };
    }
};


export async function obtenerApuntesPopularesSemanaService() {
    try {
        const response = await axios.get(`/api/estadisticas/apuntes-populares-semana`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error al obtener apuntes populares de la semana:', error);
        return { status: 'Error', message: error.response?.data?.message || 'Error al obtener datos' };
    }
};

export async function obtenerTopContribuidoresSemanaService() {
    try {
        const response = await axios.get(`/api/estadisticas/top-contribuidores-semana`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error al obtener top contribuidores:', error);
        return { status: 'Error', message: error.response?.data?.message || 'Error al obtener datos' };
    }
};

export async function obtenerDescargasSemanaService() {
    try {
        const response = await axios.get(`/api/estadisticas/descargas-semana`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error al obtener descargas de la semana:', error);
        return { status: 'Error', message: error.response?.data?.message || 'Error al obtener datos' };
    }
};

export async function obtenerDiaMasActivoSemanaService() {
    try {
        const response = await axios.get(`/api/estadisticas/dia-mas-activo-semana`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error al obtener día más activo:', error);
        return { status: 'Error', message: error.response?.data?.message || 'Error al obtener datos' };
    }
};

// Engagement
export async function obtenerValoracionPromedioSistemaService() {
    try {
        const response = await axios.get(`/api/estadisticas/valoracion-promedio`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error al obtener valoración promedio:', error);
        return { status: 'Error', message: error.response?.data?.message || 'Error al obtener datos' };
    }
};

export async function obtenerApuntesMasComentadosService() {
    try {
        const response = await axios.get(`/api/estadisticas/apuntes-mas-comentados`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error al obtener apuntes más comentados:', error);
        return { status: 'Error', message: error.response?.data?.message || 'Error al obtener datos' };
    }
};

// Tendencias
export async function obtenerCrecimientoMensualService() {
    try {
        const response = await axios.get(`/api/estadisticas/crecimiento-mensual`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error al obtener crecimiento mensual:', error);
        return { status: 'Error', message: error.response?.data?.message || 'Error al obtener datos' };
    }
};

export async function obtenerApunteMasDescargadoService() {
    try {
        const response = await axios.get(`/api/estadisticas/apunte-mas-descargado`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error al obtener apunte más descargado:', error);
        return { status: 'Error', message: error.response?.data?.message || 'Error al obtener datos' };
    }
};

// Admin Dashboard Specifics
export async function obtenerAsignaturasSinApuntesService() {
    try {
        const response = await axios.get(`/api/estadisticas/asignaturas-sin-apuntes`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error al obtener asignaturas sin apuntes:', error);
        return { status: 'Error', message: error.response?.data?.message || 'Error al obtener datos' };
    }
};

export async function obtenerReportesPendientesService() {
    try {
        const response = await axios.get(`/api/estadisticas/reportes-pendientes`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error al obtener reportes pendientes:', error);
        return { status: 'Error', message: error.response?.data?.message || 'Error al obtener datos' };
    }
};

export async function obtenerUltimosReportesService() {
    try {
        const response = await axios.get(`/api/estadisticas/ultimos-reportes`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error al obtener últimos reportes:', error);
        return { status: 'Error', message: error.response?.data?.message || 'Error al obtener datos' };
    }
};

