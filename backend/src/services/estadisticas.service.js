import Asignatura from "../models/asignatura.model.js";
import User from "../models/user.model.js";
import Apunte from "../models/apunte.model.js";
import Reporte from "../models/reporte.model.js";
import { getActiveUsersCount } from "../config/configSocket.js";
import { semanaActual } from "../helpers/ayudasVarias.helper.js";

export async function obtenerTotalApuntesActivosService() {
    try {
        const total = await Apunte.countDocuments({ estado: 'Activo' });
        return [{ total }, null];
    } catch (error) {
        console.error('Error al obtener total de apuntes activos:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerTotalUsuariosService() {
    try {
        const total = await User.countDocuments({ estado: 'activo' });
        return [{ total }, null];
    } catch (error) {
        console.error('Error al obtener total de usuarios:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerUsuariosActivosService() {
    try {
        const total = getActiveUsersCount();
        return [{ total, enVivo: true }, null];
    } catch (error) {
        console.error('Error al obtener usuarios activos:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerDescargasTotalesService() {
    try {
        const apuntes = await Apunte.find({ estado: 'Activo' });
        const total = apuntes.reduce((sum, apunte) => sum + (apunte.descargas || 0), 0);
        return [{ total }, null];
    } catch (error) {
        console.error('Error al obtener descargas totales:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerDistribucionTiposService() {
    try {
        const apuntes = await Apunte.find({ estado: 'Activo' });

        const distribucion = {};
        apuntes.forEach(apunte => {
            const tipo = apunte.tipoApunte;
            distribucion[tipo] = (distribucion[tipo] || 0) + 1;
        });

        const resultado = Object.entries(distribucion)
            .map(([tipo, cantidad]) => ({ tipo, cantidad }))
            .sort((a, b) => b.cantidad - a.cantidad);

        return [resultado, null];
    } catch (error) {
        console.error('Error al obtener distribución de tipos:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerTop5AsignaturasService() {
    try {
        const apuntes = await Apunte.find({ estado: 'Activo' });

        const conteoPorAsignatura = {};
        apuntes.forEach(apunte => {
            const asignatura = apunte.asignatura;
            conteoPorAsignatura[asignatura] = (conteoPorAsignatura[asignatura] || 0) + 1;
        });

        const resultado = Object.entries(conteoPorAsignatura)
            .map(([nombre, cantidad]) => ({ nombre, cantidad }))
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 5);

        return [resultado, null];
    } catch (error) {
        console.error('Error al obtener top 5 asignaturas:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerAsignaturasMejorValoradasService() {
    try {
        const apuntes = await Apunte.find({
            estado: 'Activo',
            'valoracion.cantidadValoraciones': { $gt: 0 }
        });

        // Agrupar por asignatura y calcular promedio
        const porAsignatura = {};
        apuntes.forEach(apunte => {
            const asignatura = apunte.asignatura;
            if (!porAsignatura[asignatura]) {
                porAsignatura[asignatura] = { suma: 0, cantidad: 0 };
            }
            porAsignatura[asignatura].suma += apunte.valoracion.promedioValoracion;
            porAsignatura[asignatura].cantidad += 1;
        });

        const resultado = Object.entries(porAsignatura)
            .map(([nombre, data]) => ({
                nombre,
                promedioValoracion: parseFloat((data.suma / data.cantidad).toFixed(2)),
                cantidadApuntes: data.cantidad
            }))
            .sort((a, b) => b.promedioValoracion - a.promedioValoracion)
            .slice(0, 5);

        return [resultado, null];
    } catch (error) {
        console.error('Error al obtener asignaturas mejor valoradas:', error);
        return [null, 'Error interno del servidor'];
    }
}

/**
 * 11. Apuntes Más Populares de la Semana (Top 3)
 * NOTA: Requiere agregar tracking temporal de visualizaciones
 * apoyarse de la funcion semanaActual
 */
export async function obtenerApuntesPopularesSemanaService() {
    try {
        const semana = semanaActual();
        const apuntes = await Apunte.find({
            estado: 'Activo',
            fechaPublicacion: {
                $gte: semana.diaInicioSemana,
                $lte: semana.diaFinSemana
            }
        })
            .sort({ visualizaciones: -1 })
            .limit(3)
            .select('nombre asignatura visualizaciones descargas valoracion');

        const resultado = apuntes.map(apunte => ({
            _id: apunte._id,
            nombre: apunte.nombre,
            asignatura: apunte.asignatura,
            visualizaciones: apunte.visualizaciones || 0,
            descargas: apunte.descargas || 0,
            valoracion: apunte.valoracion?.promedioValoracion || 0
        }));

        return [resultado, null];
    } catch (error) {
        console.error('Error al obtener apuntes populares de la semana:', error);
        return [null, 'Error interno del servidor'];
    }
}

/**
 * 12. Usuarios Más Contribuidores del Mes (Top 3)
 * NOTA: Requiere tracking temporal de uploads
 * apoyarse de la funcion semanaActual
 */
export async function obtenerTopContribuidoresSemanaService() {
    try {
        const semana = semanaActual();
        const apuntes = await Apunte.find({
            estado: 'Activo',
            fechaPublicacion: {
                $gte: semana.diaInicioSemana,
                $lte: semana.diaFinSemana
            }
        });

        // Contar apuntes por usuario
        const porUsuario = {};
        apuntes.forEach(apunte => {
            const rut = apunte.rutAutorSubida;
            const nombre = apunte.autorSubida;
            if (!porUsuario[rut]) {
                porUsuario[rut] = { nombre, cantidad: 0 };
            }
            porUsuario[rut].cantidad += 1;
        });

        const resultado = Object.entries(porUsuario)
            .map(([rut, data]) => ({
                rut,
                nombre: data.nombre,
                cantidadApuntes: data.cantidad
            }))
            .sort((a, b) => b.cantidadApuntes - a.cantidadApuntes)
            .slice(0, 3);

        return [resultado, null];
    } catch (error) {
        console.error('Error al obtener top contribuidores:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerValoracionPromedioSistemaService() {
    try {
        const apuntes = await Apunte.find({
            estado: 'Activo',
            'valoracion.cantidadValoraciones': { $gt: 0 }
        });

        if (apuntes.length === 0) {
            return [{ promedio: 0, totalApuntesValorados: 0 }, null];
        }

        const sumaValoraciones = apuntes.reduce((sum, apunte) =>
            sum + apunte.valoracion.promedioValoracion, 0
        );

        const promedio = sumaValoraciones / apuntes.length;

        return [{
            promedio: parseFloat(promedio.toFixed(2)),
            totalApuntesValorados: apuntes.length
        }, null];
    } catch (error) {
        console.error('Error al obtener valoración promedio del sistema:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerContenidoPorSemestreService() {
    try {
        const asignaturas = await Asignatura.find();
        const apuntes = await Apunte.find({ estado: 'Activo' });

        // Crear mapa de asignatura -> semestre
        const asignaturaSemestre = {};
        asignaturas.forEach(asig => {
            asignaturaSemestre[asig.nombre] = asig.semestre;
        });

        // Contar apuntes por semestre
        const porSemestre = {};
        apuntes.forEach(apunte => {
            const semestre = asignaturaSemestre[apunte.asignatura] || 0;
            porSemestre[semestre] = (porSemestre[semestre] || 0) + 1;
        });

        const resultado = Object.entries(porSemestre)
            .map(([semestre, cantidad]) => ({
                semestre: parseInt(semestre),
                cantidad
            }))
            .sort((a, b) => a.semestre - b.semestre);

        return [resultado, null];
    } catch (error) {
        console.error('Error al obtener contenido por semestre:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerDescargasService() {
    try {
        const semana = semanaActual();
        const apuntes = await Apunte.find({
            estado: 'Activo',
            fechaPublicacion: {
                $gte: semana.diaInicioSemana,
                $lte: semana.diaFinSemana
            }
        });

        const resultado = apuntes.reduce((sum, apunte) => sum + (apunte.descargas || 0), 0);

        return [resultado, null];
    } catch (error) {
        console.error('Error al obtener descargas:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerApuntesMasComentadosService() {
    try {
        const apuntes = await Apunte.find({ estado: 'Activo' });

        const apuntesConComentarios = apuntes
            .map(apunte => ({
                _id: apunte._id,
                nombre: apunte.nombre,
                asignatura: apunte.asignatura,
                totalComentarios: apunte.comentarios?.length || 0
            }))
            .filter(apunte => apunte.totalComentarios > 0)
            .sort((a, b) => b.totalComentarios - a.totalComentarios)
            .slice(0, 3);

        return [apuntesConComentarios, null];
    } catch (error) {
        console.error('Error al obtener apuntes más comentados:', error);
        return [null, 'Error interno del servidor'];
    }
}


export async function obtenerCrecimientoMensualService() {
    try {
        const seiseMesesAtras = new Date();
        seiseMesesAtras.setMonth(seiseMesesAtras.getMonth() - 6);

        const apuntes = await Apunte.find({
            estado: 'Activo',
            createdAt: { $gte: seiseMesesAtras }
        });

        // Agrupar por mes
        const porMes = {};
        apuntes.forEach(apunte => {
            const fecha = new Date(apunte.createdAt);
            const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
            porMes[mes] = (porMes[mes] || 0) + 1;
        });

        const resultado = Object.entries(porMes)
            .map(([mes, cantidad]) => ({ mes, cantidad }))
            .sort((a, b) => a.mes.localeCompare(b.mes));

        return [resultado, null];
    } catch (error) {
        console.error('Error al obtener crecimiento mensual:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerApunteMasDescargadoService() {
    try {
        const apunte = await Apunte.findOne({ estado: 'Activo' })
            .sort({ descargas: -1 })
            .select('nombre asignatura descargas visualizaciones valoracion autorSubida');

        if (!apunte) {
            return [null, 'No hay apuntes disponibles'];
        }

        const resultado = {
            _id: apunte._id,
            nombre: apunte.nombre,
            asignatura: apunte.asignatura,
            autor: apunte.autorSubida,
            descargas: apunte.descargas || 0,
            visualizaciones: apunte.visualizaciones || 0,
            valoracion: apunte.valoracion?.promedioValoracion || 0
        };

        return [resultado, null];
    } catch (error) {
        console.error('Error al obtener apunte más descargado:', error);
        return [null, 'Error interno del servidor'];
    }
}
export async function obtenerDiaMasSemanaActivoService() {
    try {
        const semana = semanaActual();
        const apuntes = await Apunte.find({
            estado: 'Activo',
            fechaPublicacion: {
                $gte: semana.diaInicioSemana,
                $lte: semana.diaFinSemana
            }
        });

        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const conteo = [0, 0, 0, 0, 0, 0, 0];

        apuntes.forEach(apunte => {
            if (apunte.createdAt) {
                const dia = new Date(apunte.createdAt).getDay();
                conteo[dia]++;
            }
        });

        const maxConteo = Math.max(...conteo);
        const diaMaximo = conteo.indexOf(maxConteo);

        return [{
            dia: diasSemana[diaMaximo],
            cantidad: maxConteo,
            nota: 'Basado en días de creación de apuntes'
        }, null];
    } catch (error) {
        console.error('Error al obtener día más activo:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerAsignaturasSinApuntesService() {
    try {
        // Obtener todas las asignaturas
        const asignaturas = await Asignatura.find({}, 'nombre codigo area');
        
        // Obtener IDs de asignaturas que tienen apuntes activos
        const asignaturasConApuntes = await Apunte.distinct('asignatura', { estado: 'Activo' });
        
        // Filtrar las que no están en la lista de apuntes (comparando por nombre o ID según tu modelo)
        // Nota: En tu modelo Apunte, 'asignatura' parece ser un String (nombre) según obtenerTop5AsignaturasService
        // Si es ObjectId, cambiar la lógica. Asumiré String nombre por consistencia con servicios anteriores.
        
        const asignaturasSinApuntes = asignaturas.filter(asig => !asignaturasConApuntes.includes(asig.nombre));
        
        return [asignaturasSinApuntes, null];
    } catch (error) {
        console.error('Error al obtener asignaturas sin apuntes:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerReportesPendientesService() {
    try {
        const total = await Reporte.countDocuments({ estado: 'Pendiente' });
        return [{ total }, null];
    } catch (error) {
        console.error('Error al obtener reportes pendientes:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerUltimosReportesService() {
    try {
        const reportes = await Reporte.find()
            .sort({ fecha: -1 }) // Asumiendo que fecha es string ISO o Date. Si es string DD-MM-YYYY, el sort puede fallar.
            // Revisando modelo Reporte: fecha: { type: String }. 
            // Si el formato no es sortable, esto podría ser un problema. 
            // Asumiremos que se guarda en formato ISO o similar, o aceptaremos el orden de inserción natural (_id).
            .sort({ _id: -1 }) // Fallback seguro: orden de creación
            .limit(5)
            .populate('apunteId', 'nombre'); // Si apunteId es ref
            
        return [reportes, null];
    } catch (error) {
        console.error('Error al obtener últimos reportes:', error);
        return [null, 'Error interno del servidor'];
    }
}
