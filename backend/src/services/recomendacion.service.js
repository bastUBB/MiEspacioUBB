import Apunte from '../models/apunte.model.js';
import perfilAcademico from '../models/perfilAcademico.model.js';
import HistorialUsuario from '../models/historialUsuario.model.js';
import {
    PESOS_DIMENSIONES,
    CONFIG_DIVERSIDAD,
    MAPEO_TIPO_METODO,
    calcularPromedioNotas,
    inferirRendimientoDesdeComplejidad,
    calcularConfiabilidadValoracion,
    calcularFrescura,
    calcularOverlap,
    obtenerAsignaturasRelacionadas,
    calcularBoostFactor,
    calcularPenalizacion,
    aplicarDiversificacion,
    sonSimilares
} from '../helpers/recomendacion.helper.js';

/**
 * Genera recomendaciones personalizadas para un usuario
 * @param {String} rutUser - RUT del usuario
 * @param {Number} limite - Cantidad máxima de recomendaciones (default: 20)
 * @returns {Array} [recomendaciones, error]
 */
export async function generarRecomendacionPersonalizadaService(rutUser, limite = 20) {
    try {
        // 1. Obtener contexto del usuario
        const usuario = await perfilAcademico.findOne({ rutUser }).populate('apuntesValorados.apunteID');

        if (!usuario) return [null, 'El usuario no posee perfil académico'];

        const historial = await HistorialUsuario.findOne({ rutUser });

        // 2. Pre-filtrado de candidatos
        const [candidatos, errorCandidatos] = await filtrarApuntesCandidatos(usuario);

        if (errorCandidatos) return [null, errorCandidatos];
        if (!candidatos || candidatos.length === 0) {
            return [[], null]; // Retornar array vacío si no hay candidatos
        }

        // 3. Calcular scores para cada candidato
        const apuntesConScore = candidatos.map(apunte => {
            const score = calcularScoreFinal(apunte, usuario, historial);
            const explicacion = generarExplicacionRecomendacion(apunte, usuario, score);

            return {
                apunte,
                score,
                explicacion
            };
        });

        // 4. Aplicar diversificación y ordenamiento
        const recomendacionesDiversificadas = aplicarDiversificacion(
            apuntesConScore,
            CONFIG_DIVERSIDAD
        );

        // 5. Limitar resultados
        const recomendacionesFinales = recomendacionesDiversificadas
            .slice(0, limite)
            .map(item => ({
                apunte: item.apunte,
                scoreRecomendacion: parseFloat(item.score.toFixed(3)),
                razonRecomendacion: item.explicacion
            }));

        return [recomendacionesFinales, null];

    } catch (error) {
        console.error('Error generando recomendaciones personalizadas:', error);
        return [null, 'Error interno al generar recomendaciones'];
    }
}

/**
 * Filtra apuntes candidatos según criterios del perfil del usuario
 * @param {Object} usuario - Perfil académico del usuario
 * @returns {Array} [candidatos, error]
 */
async function filtrarApuntesCandidatos(usuario) {
    try {
        // Construir lista de asignaturas relevantes
        const asignaturasRelevantes = new Set([
            ...usuario.asignaturasCursantes,
            ...usuario.asignaturasInteres
        ]);

        // Agregar asignaturas relacionadas del curricular
        usuario.informeCurricular.forEach(info => {
            const relacionadas = obtenerAsignaturasRelacionadas(
                usuario.informeCurricular,
                info.asignatura
            );
            relacionadas.forEach(asig => asignaturasRelevantes.add(asig));
        });

        // IDs de apuntes a excluir (ya valorados)
        const idsExcluir = usuario.apuntesValorados.map(v => v.apunteID);

        // Filtrar apuntes
        const candidatos = await Apunte.find({
            estado: 'Activo',
            asignatura: { $in: Array.from(asignaturasRelevantes) },
            _id: { $nin: idsExcluir }
        }).populate('comentarios');

        return [candidatos, null];

    } catch (error) {
        console.error('Error filtrando candidatos:', error);
        return [null, 'Error al filtrar apuntes candidatos'];
    }
}

/**
 * Calcula el score final de un apunte para un usuario
 * @param {Object} apunte - Apunte a evaluar
 * @param {Object} usuario - Perfil académico del usuario
 * @param {Object} historial - Historial del usuario
 * @returns {Number} - Score final [0, 1]
 */
function calcularScoreFinal(apunte, usuario, historial) {
    // Calcular cada dimensión del score
    const scoreRelevancia = calcularRelevanciaAcademica(
        apunte,
        usuario
    ) * PESOS_DIMENSIONES.relevanciaAcademica;

    const scoreRendimiento = calcularAfinidadRendimiento(
        apunte,
        usuario
    ) * PESOS_DIMENSIONES.rendimientoContextual;

    const scoreMetodo = calcularMatchMetodoEstudio(
        apunte,
        usuario
    ) * PESOS_DIMENSIONES.metodoEstudio;

    const scoreCalidad = calcularScoreCalidad(
        apunte,
        usuario
    ) * PESOS_DIMENSIONES.calidad;

    const scoreTemporal = calcularScoreTemporal(
        apunte,
        historial
    ) * PESOS_DIMENSIONES.temporal;

    // Sumar dimensiones
    const scoreBase = scoreRelevancia + scoreRendimiento + scoreMetodo +
        scoreCalidad + scoreTemporal;

    // Aplicar factores multiplicativos
    const boost = calcularBoostFactor(apunte, usuario);
    const penalizacion = calcularPenalizacion(apunte, usuario);

    return scoreBase * boost * penalizacion;
}

/**
 * Dimensión 1: Relevancia Académica (35%)
 * Evalúa qué tan relevante es el apunte según asignaturas del usuario
 */
function calcularRelevanciaAcademica(apunte, usuario) {
    let score = 0;

    // Match directo con asignaturas cursantes (peso máximo)
    if (usuario.asignaturasCursantes.includes(apunte.asignatura)) {
        score += 0.50;
    }

    // Match con asignaturas de interés
    if (usuario.asignaturasInteres.includes(apunte.asignatura)) {
        score += 0.30;
    }

    // Match con asignaturas relacionadas del curricular
    const relacionadas = obtenerAsignaturasRelacionadas(
        usuario.informeCurricular,
        apunte.asignatura
    );

    if (relacionadas.length > 0) {
        const factorRelacion = relacionadas.length / Math.max(usuario.informeCurricular.length, 1);
        score += 0.20 * Math.min(factorRelacion, 1.0);
    }

    // Bonus por match de etiquetas con asignaturas
    if (apunte.etiquetas && apunte.etiquetas.length > 0) {
        const todasAsignaturas = [
            ...usuario.asignaturasCursantes,
            ...usuario.asignaturasInteres
        ];
        const matchEtiquetas = apunte.etiquetas.some(etiqueta =>
            todasAsignaturas.some(asig => sonSimilares(etiqueta, asig))
        );
        if (matchEtiquetas) {
            score += 0.10;
        }
    }

    return Math.min(score, 1.0);
}

/**
 * Dimensión 2: Afinidad por Rendimiento (25%)
 * Ajusta recomendaciones según el desempeño académico del usuario
 * 
 * Soporta 3 escenarios:
 * 1. Usuario tiene notas → calcula promedio y usa matriz
 * 2. Usuario NO tiene notas pero SÍ tiene ordenComplejidad → infiere rendimiento
 * 3. Usuario NO tiene ninguno → score neutro (0.5)
 */
function calcularAfinidadRendimiento(apunte, usuario) {
    // Buscar información de la asignatura en el curricular
    const infoAsignatura = usuario.informeCurricular.find(
        info => info.asignatura === apunte.asignatura
    );

    // Si no hay información previa de la asignatura, retornar score neutro
    if (!infoAsignatura) return 0.5;

    // Si el apunte no tiene complejidad definida, usar score neutro
    if (!apunte.complejidad) return 0.5;

    let nivelRendimiento = null;

    // ESCENARIO 1: Intentar usar notas (prioridad)
    if (infoAsignatura.evaluaciones && infoAsignatura.evaluaciones.length > 0) {
        // Verificar si al menos una evaluación tiene nota
        const hayNotas = infoAsignatura.evaluaciones.some(ev => ev.nota);

        if (hayNotas) {
            const promedio = calcularPromedioNotas(infoAsignatura.evaluaciones);

            // Solo usar el promedio si es válido (> 0)
            if (promedio > 0) {
                if (promedio < 4.5) {
                    nivelRendimiento = 'bajo';
                } else if (promedio <= 5.5) {
                    nivelRendimiento = 'medio';
                } else {
                    nivelRendimiento = 'alto';
                }
            }
        }
    }

    // ESCENARIO 2: Si no hay notas, intentar usar ordenComplejidad
    if (!nivelRendimiento && infoAsignatura.ordenComplejidad) {
        nivelRendimiento = inferirRendimientoDesdeComplejidad(
            infoAsignatura.ordenComplejidad
        );
    }

    // ESCENARIO 3: Si no hay ni notas ni complejidad → score neutro
    if (!nivelRendimiento) return 0.5;

    // Matriz de preferencias: mapea complejidad del apunte con rendimiento del usuario
    const preferencias = {
        'Básico': {
            bajo: 1.0,    // promedio < 4.5 o complejidad 4-5
            medio: 0.7,   // 4.5 <= promedio <= 5.5 o complejidad 3
            alto: 0.4     // promedio > 5.5 o complejidad 1-2
        },
        'Intermedio': {
            bajo: 0.7,
            medio: 1.0,
            alto: 0.8
        },
        'Avanzado': {
            bajo: 0.3,
            medio: 0.7,
            alto: 1.0
        }
    };

    return preferencias[apunte.complejidad]?.[nivelRendimiento] || 0.5;
}

/**
 * Dimensión 3: Match con Método de Estudio (20%)
 * Evalúa compatibilidad entre tipo de apunte y métodos preferidos del usuario
 */
function calcularMatchMetodoEstudio(apunte, usuario) {
    if (!usuario.metodosEstudiosPreferidos ||
        usuario.metodosEstudiosPreferidos.length === 0) {
        return 0.5; // Score neutro si no hay preferencias
    }

    const metodosCompatibles = MAPEO_TIPO_METODO[apunte.tipoApunte] || [];

    if (metodosCompatibles.length === 0) return 0.5;

    // Calcular overlap entre métodos preferidos y compatibles
    const overlap = calcularOverlap(
        usuario.metodosEstudiosPreferidos,
        metodosCompatibles
    );

    return overlap;
}

/**
 * Dimensión 4: Calidad del Apunte (15%)
 * Evalúa calidad basándose en valoraciones y reputación
 */
function calcularScoreCalidad(apunte, usuario) {
    let score = 0;

    // Componente 1: Valoración promedio normalizada (60%)
    if (apunte.valoracion && apunte.valoracion.promedioValoracion) {
        const valoracionNormalizada = apunte.valoracion.promedioValoracion / 5.0;
        score += valoracionNormalizada * 0.60;
    } else {
        score += 0.5 * 0.60; // Score neutro si no hay valoraciones
    }

    // Componente 2: Confiabilidad según cantidad de valoraciones (25%)
    const cantidadValoraciones = apunte.valoracion?.cantidadValoraciones || 0;
    const confiabilidad = calcularConfiabilidadValoracion(cantidadValoraciones);
    score += confiabilidad * 0.25;

    // Componente 3: Factor de popularidad ajustado (15%)
    // Apuntes con visualizaciones pero sin descargas tienen penalización
    const ratioDescargasVistas = apunte.visualizaciones > 0
        ? (apunte.descargas || 0) / apunte.visualizaciones
        : 0.5;
    score += Math.min(ratioDescargasVistas, 1.0) * 0.15;

    return Math.min(score, 1.0);
}

/**
 * Dimensión 5: Factor Temporal (5%)
 * Considera frescura del apunte y patrones temporales
 */
function calcularScoreTemporal(apunte, historial) {
    let score = 0;

    // Componente 1: Frescura del apunte (40%)
    const frescura = calcularFrescura(apunte.fechaSubida);
    score += frescura * 0.40;

    // Componente 2: Tendencia de interacción del usuario (35%)
    // Si el usuario ha interactuado recientemente con apuntes similares
    if (historial && historial.acciones && historial.acciones.length > 0) {
        const accionesRecientes = historial.acciones
            .filter(accion => {
                const fechaAccion = new Date(accion.fechaAccion);
                const diasDesdeAccion = (new Date() - fechaAccion) / (1000 * 60 * 60 * 24);
                return diasDesdeAccion <= 30; // Últimos 30 días
            });

        const factorActividad = Math.min(accionesRecientes.length / 10, 1.0);
        score += factorActividad * 0.35;
    } else {
        score += 0.5 * 0.35; // Score neutro si no hay historial
    }

    // Componente 3: Momento del semestre (25%)
    // Esto podría refinarse según calendario académico real
    score += 0.5 * 0.25;

    return Math.min(score, 1.0);
}

/**
 * Genera una explicación legible de por qué se recomienda un apunte
 */
function generarExplicacionRecomendacion(apunte, usuario, score) {
    const razones = [];

    // Razón 1: Asignatura
    if (usuario.asignaturasCursantes.includes(apunte.asignatura)) {
        razones.push(`Estás cursando ${apunte.asignatura}`);
    } else if (usuario.asignaturasInteres.includes(apunte.asignatura)) {
        razones.push(`Es de tu interés: ${apunte.asignatura}`);
    }

    // Razón 2: Calidad
    if (apunte.valoracion?.promedioValoracion >= 4.0) {
        razones.push(`Alta valoración (${apunte.valoracion.promedioValoracion.toFixed(1)}/5.0)`);
    }

    // Razón 3: Método de estudio
    const metodosCompatibles = MAPEO_TIPO_METODO[apunte.tipoApunte] || [];
    const matchMetodo = usuario.metodosEstudiosPreferidos.some(metodo =>
        metodosCompatibles.some(compatible => sonSimilares(metodo, compatible))
    );
    if (matchMetodo) {
        razones.push(`Compatible con tu método de estudio`);
    }

    // Razón 4: Popularidad
    if (apunte.descargas > 100) {
        razones.push(`Muy descargado (${apunte.descargas} descargas)`);
    }

    // Razón 5: Frescura
    const diasDesdeSubida = (new Date() - new Date(apunte.fechaSubida)) / (1000 * 60 * 60 * 24);
    if (diasDesdeSubida < 30) {
        razones.push('Contenido reciente');
    }

    // Si no hay razones específicas, dar razón genérica
    if (razones.length === 0) {
        razones.push('Recomendado según tu perfil académico');
    }

    return razones.join(' • ');
}

/**
 * Obtiene apuntes recomendados para usuarios sin perfil académico
 * (Recomendaciones genéricas basadas en popularidad)
 */
export async function obtenerRecomendacionesGenericasService(limite = 20) {
    try {
        const apuntesPopulares = await Apunte.find({ estado: 'Activo' })
            .sort({
                'valoracion.promedioValoracion': -1,
                'valoracion.cantidadValoraciones': -1,
                descargas: -1
            })
            .limit(limite);

        const recomendaciones = apuntesPopulares.map(apunte => ({
            apunte,
            scoreRecomendacion: 0,
            razonRecomendacion: 'Popular entre los usuarios'
        }));

        return [recomendaciones, null];

    } catch (error) {
        console.error('Error obteniendo recomendaciones genéricas:', error);
        return [null, 'Error interno al obtener recomendaciones'];
    }
}

/**
 * Obtiene recomendaciones por asignatura específica
 */
export async function obtenerRecomendacionesPorAsignaturaService(rutUser, asignatura, limite = 10) {
    try {
        const usuario = await perfilAcademico.findOne({ rutUser });

        // IDs a excluir
        const idsExcluir = usuario?.apuntesValorados.map(v => v.apunteID) || [];

        const apuntes = await Apunte.find({
            estado: 'Activo',
            asignatura: asignatura,
            _id: { $nin: idsExcluir }
        }).sort({
            'valoracion.promedioValoracion': -1,
            descargas: -1
        }).limit(limite);

        if (!apuntes || apuntes.length === 0) {
            return [[], null];
        }

        // Si hay usuario con perfil, aplicar scoring
        let recomendaciones;
        if (usuario) {
            recomendaciones = apuntes.map(apunte => {
                const score = calcularScoreFinal(apunte, usuario, null);
                return {
                    apunte,
                    scoreRecomendacion: parseFloat(score.toFixed(3)),
                    razonRecomendacion: generarExplicacionRecomendacion(apunte, usuario, score)
                };
            }).sort((a, b) => b.scoreRecomendacion - a.scoreRecomendacion);
        } else {
            recomendaciones = apuntes.map(apunte => ({
                apunte,
                scoreRecomendacion: 0,
                razonRecomendacion: `Recomendado para ${asignatura}`
            }));
        }

        return [recomendaciones, null];

    } catch (error) {
        console.error('Error obteniendo recomendaciones por asignatura:', error);
        return [null, 'Error interno al obtener recomendaciones'];
    }
}
