import axios from 'axios';

export async function crearApunteService(apunteData, file) {
    try {
        const formData = new FormData();

        formData.append('archivo', file);
        formData.append('nombre', apunteData.nombre);
        formData.append('descripcion', apunteData.descripcion);
        formData.append('asignatura', apunteData.asignatura);
        formData.append('tipoApunte', apunteData.tipoApunte);
        formData.append('fechaSubida', apunteData.fechaSubida);
        formData.append('autorSubida', apunteData.autorSubida);
        formData.append('rutAutorSubida', apunteData.rutAutorSubida);

        if (apunteData.autores && apunteData.autores.length > 0) {
            apunteData.autores.forEach(autor => {
                formData.append('autores[]', autor);
            });
        }

        if (apunteData.etiquetas && apunteData.etiquetas.length > 0) {
            apunteData.etiquetas.forEach(etiqueta => {
                formData.append('etiquetas[]', etiqueta);
            });
        }

        const response = await axios.post('/api/apuntes/', formData);

        return response.data;
    } catch (error) {
        console.error("Error al crear apunte:", error);
        throw error;
    }
}

// TODO: Ver mas adelante
// export async function updateApunteService(apunteData) {}

// TODO: Ver mas adelante
// export async function deleteApunteService(apunteID) {}

export async function obtenerMisApuntesByRutService(rutAutorSubida) {
    try {
        const response = await axios.get('/api/apuntes/apuntes-rut/detail', {
            params: { rutAutorSubida }
        });

        return response.data;
    } catch (error) {
        console.error("Error al obtener mis apuntes:", error.response?.data || error.message);
        throw error;
    }
}

export async function getAllApuntesService() {
    try {
        const response = await axios.get('/api/apuntes/');

        return response.data;
    } catch (error) {
        console.error("Error al obtener todos los apuntes:", error);
        throw error;
    }
}

export async function sumarVisualizacionInvitadoApunteService(apunteID) {
    try {
        const response = await axios.post('/api/apuntes/visualizacion-invitado/detail', { _id: apunteID });

        return response.data;
    } catch (error) {
        console.error("Error al sumar visualización de invitado al apunte:", error);
        throw error;
    }
}

export async function sumarVisualizacionUsuariosApunteService(apunteID, rutUsuario) {
    try {
        const response = await axios.post('/api/apuntes/visualizacion-usuario/detail', {
            _id: apunteID,
            rutUsuario
        });

        return response.data;
    } catch (error) {
        console.error("Error al sumar visualización de usuario al apunte:", error);
        throw error;
    }
}

export async function crearComentarioApunteService(apunteID, comentarioData) {
    try {
        const response = await axios.post('/api/apuntes/crear-comentario/detail', comentarioData, {
            params: { apunteID }
        });

        return response.data;
    } catch (error) {
        console.error("Error al crear comentario de apunte:", error);
        throw error;
    }
}

export async function crearRespuestaComentarioApunteService(apunteID, respuestaData) {
    try {
        const response = await axios.post('/api/apuntes/respuesta-comentario/detail', respuestaData, {
            params: { apunteID }
        });

        return response.data;
    } catch (error) {
        console.error("Error al crear respuesta de comentario de apunte:", error);
        throw error;
    }
}

export async function darLikeComentarioService(comentarioID) {
    try {
        const response = await axios.post('/api/comentarios/like/detail', {}, {
            params: { _id: comentarioID }
        });

        return response.data;
    } catch (error) {
        console.error("Error al dar like al comentario:", error);
        throw error;
    }
}

export async function darDislikeComentarioService(comentarioID) {
    try {
        const response = await axios.post('/api/comentarios/dislike/detail', {}, {
            params: { _id: comentarioID }
        });

        return response.data;
    } catch (error) {
        console.error("Error al dar dislike al comentario:", error);
        throw error;
    }
}

export async function realizarValoracionApunteService(apunteID, rutUsuarioValoracion, valoracion) {
    try {
        const response = await axios.post('/api/apuntes/valoracion/detail', {
            rutUserValoracion: rutUsuarioValoracion,
            valoracion
        }, {
            params: { apunteID }
        });

        return response.data;
    } catch (error) {
        console.error("Error al realizar valoración de apunte:", error);
        throw error;
    }
}

export async function obtenerValoracionUsuarioApunteService(apunteID, rutUsuario) {
    try {
        const response = await axios.get('/api/apuntes/valoracion/detail', {
            params: {
                apunteID,
                rutAutorSubida: rutUsuario
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error al obtener valoración del usuario:", error);
        throw error;
    }
}

export async function actualizarValoracionApunteService(apunteID, rutUsuarioValoracion, valoracion) {
    try {
        const response = await axios.put('/api/apuntes/valoracion/detail', {
            rutUserValoracion: rutUsuarioValoracion,
            valoracion
        }, {
            params: { apunteID }
        });

        return response.data;
    } catch (error) {
        console.error("Error al actualizar valoración de apunte:", error);
        throw error;
    }
}

export async function crearReporteApunteService(apunteID, reporteData) {
    try {
        const response = await axios.post('/api/apuntes/reporte/detail', reporteData, {
            params: { apunteID }
        });

        return response.data;
    } catch (error) {
        console.error("Error al crear reporte de apunte:", error);
        throw error;
    }
}

export async function obtenerApuntesMasValoradosService() {
    try {
        const response = await axios.get('/api/apuntes/mas-valorados/');

        return response.data;
    } catch (error) {
        console.error("Error al obtener apuntes más valorados:", error);
        throw error;
    }
}

export async function obtenerApuntesMasVisualizadosService() {
    try {
        const response = await axios.get('/api/apuntes/mas-visualizados/');

        return response.data;
    } catch (error) {
        console.error("Error al obtener apuntes más visualizados:", error);
        throw error;
    }
}

export async function obtenerAsignaturasConMasApuntesService() {
    try {
        const response = await axios.get('/api/apuntes/asignaturas-mas-apuntes/');

        return response.data;
    } catch (error) {
        console.error("Error al obtener asignaturas con más apuntes:", error);
        throw error;
    }
}

export async function obtenerApuntePorIdService(apunteID) {
    try {
        const response = await axios.get('/api/apuntes/detail', {
            params: { apunteID }
        });

        return response.data;
    } catch (error) {
        console.error("Error al obtener apunte por ID:", error);
        throw error;
    }
}

export async function busquedaApuntesMismoAutorService(rutUser, asignaturaApunteActual) {
    try {
        const response = await axios.post('/api/apuntes/busqueda-mismo-autor',
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
        const response = await axios.post('/api/apuntes/busqueda-misma-asignatura',
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

export async function obtenerLinkDescargaApunteURLFirmadaService(apunteID) {
    try {
        const response = await axios.get('/api/apuntes/url-descarga/detail', {
            params: { apunteID }
        });

        return response.data;
    } catch (error) {
        console.error("Error al obtener link de descarga del apunte:", error);
        throw error;
    }
}

export async function registrarDescargaApunteService(apunteID) {
    try {
        const response = await axios.post('/api/apuntes/descarga/detail', {}, {
            params: { apunteID }
        });

        return response.data;
    } catch (error) {
        console.error("Error al registrar descarga del apunte:", error);
        throw error;
    }
}

export async function obtenerCantidadApuntesService() {
    try {
        const response = await axios.get('/api/apuntes/cantidad-apuntes/');

        return response.data;
    } catch (error) {
        console.error("Error al obtener la cantidad de apuntes:", error);
        throw error;
    }
}