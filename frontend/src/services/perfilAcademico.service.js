import axios from 'axios';

export async function poseePerfilAcademicoService(rutUser) {
    try {
        const response = await axios.get(`/api/perfilAcademico/poseePFA?rutUser=${rutUser}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function crearPerfilAcademicoService(dataPerfilAcademico) {
    try {
        const response = await axios.post('/api/perfilAcademico/', dataPerfilAcademico);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function crearPerfilAcademicoDocenteService(dataPerfilAcademico) {
    try {
        const response = await axios.post('/api/perfilAcademico/docente', dataPerfilAcademico);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function crearPerfilAcademicoAyudanteService(dataPerfilAcademico) {
    try {
        const response = await axios.post('/api/perfilAcademico/ayudante', dataPerfilAcademico);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getPerfilAcademicoService(rutUser) {
    try {
        const response = await axios.get('/api/perfilAcademico/detail', {
            params: { rutUser }
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener perfil académico:", error);
        throw error;
    }
}

export async function numeroApuntesUserService(rutUser) {
    try {
        const response = await axios.get('/api/perfilAcademico/numero-apuntes/detail', {
            params: { rutUser }
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener número de apuntes:", error);
        throw error;
    }
}

export async function obtenerValoracionPerfilAcademicoService(rutUser) {
    try {
        const response = await axios.get('/api/perfilAcademico/valoracion/detail', {
            params: { rutUser }
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener valoración del perfil:", error);
        throw error;
    }
}

export async function obtenerNumeroDescargasApuntesService(rutUser) {
    try {
        const response = await axios.get('/api/perfilAcademico/numero-descargas/detail', {
            params: { rutUser }
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener número de descargas:", error);
        throw error;
    }
}

export async function busquedaApuntesMismoAutorService(rutUser, asignaturaApunteActual) {
    try {
        const response = await axios.post('/api/perfilAcademico/busquedaMismoAutor',
            { asignaturaApunteActual },
            {
                params: { rutUser }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al buscar apuntes del mismo autor:", error);
        throw error;
    }
}

export async function busquedaApuntesMismaAsignaturaService(rutUser, asignaturaApunteActual) {
    try {
        const response = await axios.post('/api/perfilAcademico/busquedaMismaAsignatura',
            { asignaturaApunteActual },
            {
                params: { rutUser }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al buscar apuntes de la misma asignatura:", error);
        throw error;
    }
}

export async function obtenerMayoresContribuidoresService() {
    try {
        const response = await axios.get('/api/perfilAcademico/mayores-contribuidores');

        return response.data;
    } catch (error) {
        console.error("Error al obtener mayores contribuidores:", error);
        throw error;
    }
}

export async function actualizarPerfilAcademicoService(rutUser, perfilData) {
    try {
        const response = await axios.patch('/api/perfilAcademico/detail', perfilData, {
            params: { rutUser }
        });

        return response.data;
    } catch (error) {
        console.error("Error al actualizar perfil académico:", error);
        throw error;
    }
}
