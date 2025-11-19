import axios from 'axios';

export async function crearReporteUserService(reporteData) {
    try {
        const response = await axios.post('/api/reportes/user', reporteData);

        return response.data;
    } catch (error) {
        console.error("Error al crear reporte de usuario:", error);
        throw error;
    }
}

export async function obtenerMisReportesService(rutUsuarioReporte) {
    try {
        const response = await axios.get('/api/reportes/mis-reportes/detail', {
            params: { rutUsuarioReporte }
        });

        return response.data;
    } catch (error) {
        console.error("Error al obtener mis reportes:", error);
        throw error;
    }
}

export async function getAllReportesPendientesPorFechaService() {
    try {
        const response = await axios.get('/api/reportes/pendientes');

        return response.data;
    } catch (error) {
        console.error("Error al obtener reportes pendientes:", error);
        throw error;
    }
}

export async function actualizarEstadoReporteService(reporteID, resolucion) {
    try {
        const response = await axios.put('/api/reportes/actualizarEstado/detail', 
            { resolucion },
            {
                params: { _id: reporteID }
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error al actualizar estado del reporte:", error);
        throw error;
    }
}
