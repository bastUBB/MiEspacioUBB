/**
 * Helper para el sistema de recomendaciones
 * Contiene funciones auxiliares para cálculos y normalización
 */

/**
 * Mapeo de tipos de apunte a métodos de estudio compatibles
 */
export const MAPEO_TIPO_METODO = {
    'Resumen': ['lectura', 'visual', 'síntesis', 'repaso'],
    'Ejercicios resueltos': ['práctica', 'problemas', 'ejercicios'],
    'Guía de estudio': ['estructurado', 'guiado', 'organizado'],
    'Mapa conceptual': ['visual', 'esquemas', 'diagramas'],
    'Ayudantía': ['práctica', 'ejemplos', 'resolución'],
    'Apuntes de clase': ['lectura', 'teoría', 'complemento'],
    'Formulario': ['referencia', 'consulta', 'repaso'],
    'Proyecto': ['práctica', 'aplicación', 'integración']
};

/**
 * Pesos del algoritmo de scoring (deben sumar 1.0)
 */
export const PESOS_DIMENSIONES = {
    relevanciaAcademica: 0.35,
    rendimientoContextual: 0.25,
    metodoEstudio: 0.20,
    calidad: 0.15,
    temporal: 0.05
};

/**
 * Configuración de diversidad en resultados
 */
export const CONFIG_DIVERSIDAD = {
    maxPorAsignatura: 4,
    porcentajeSerendipity: 0.15,
    diversidadTipos: true
};

/**
 * Calcula el promedio ponderado de las notas de una asignatura
 * @param {Array} evaluaciones - Array de evaluaciones con nota y porcentaje
 * @returns {Number} - Promedio ponderado
 */
export function calcularPromedioNotas(evaluaciones) {
    if (!evaluaciones || evaluaciones.length === 0) return 0;

    let sumaNotasPonderadas = 0;
    let sumaPorcentajes = 0;

    evaluaciones.forEach(evaluacion => {
        if (evaluacion.nota && evaluacion.porcentaje) {
            sumaNotasPonderadas += evaluacion.nota * (evaluacion.porcentaje / 100);
            sumaPorcentajes += evaluacion.porcentaje / 100;
        }
    });

    return sumaPorcentajes > 0 ? sumaNotasPonderadas / sumaPorcentajes : 0;
}

/**
 * Normaliza un score a rango [0, 1]
 * @param {Number} valor - Valor a normalizar
 * @param {Number} min - Valor mínimo
 * @param {Number} max - Valor máximo
 * @returns {Number} - Valor normalizado
 */
export function normalizar(valor, min = 0, max = 1) {
    if (max === min) return 0;
    return Math.max(0, Math.min(1, (valor - min) / (max - min)));
}

/**
 * Calcula la confiabilidad de una valoración según cantidad de votos
 * Usa función sigmoide para dar más peso a valoraciones con más votos
 * @param {Number} cantidadValoraciones - Número de valoraciones
 * @returns {Number} - Confiabilidad en rango [0, 1]
 */
export function calcularConfiabilidadValoracion(cantidadValoraciones) {
    if (!cantidadValoraciones || cantidadValoraciones === 0) return 0;
    return 1 - (1 / (1 + cantidadValoraciones / 10));
}

/**
 * Calcula el score de frescura de un apunte según su fecha de subida
 * @param {String} fechaSubida - Fecha de subida del apunte (formato string)
 * @returns {Number} - Score de frescura [0, 1]
 */
export function calcularFrescura(fechaSubida) {
    if (!fechaSubida) return 0.5;

    const fecha = new Date(fechaSubida);
    const ahora = new Date();
    const diasTranscurridos = (ahora - fecha) / (1000 * 60 * 60 * 24);

    // Apuntes muy recientes (< 30 días) tienen score alto
    if (diasTranscurridos < 30) return 1.0;
    // Apuntes hasta 180 días tienen score decreciente
    if (diasTranscurridos < 180) return 1.0 - (diasTranscurridos - 30) / 150 * 0.5;
    // Apuntes más antiguos tienen score base de 0.5
    return 0.5;
}

/**
 * Verifica si dos strings tienen similitud (ignora mayúsculas y tildes)
 * @param {String} str1 - Primera cadena
 * @param {String} str2 - Segunda cadena
 * @returns {Boolean} - True si son similares
 */
export function sonSimilares(str1, str2) {
    if (!str1 || !str2) return false;
    
    const normalize = (str) => str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
    
    return normalize(str1).includes(normalize(str2)) || 
           normalize(str2).includes(normalize(str1));
}

/**
 * Calcula el overlap (intersección) entre dos arrays
 * @param {Array} arr1 - Primer array
 * @param {Array} arr2 - Segundo array
 * @returns {Number} - Proporción de overlap [0, 1]
 */
export function calcularOverlap(arr1, arr2) {
    if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) return 0;

    let matches = 0;
    arr1.forEach(item1 => {
        if (arr2.some(item2 => sonSimilares(item1, item2))) {
            matches++;
        }
    });

    return matches / arr1.length;
}

/**
 * Obtiene asignaturas relacionadas basándose en el curricular
 * (prerequisitos, continuaciones, áreas temáticas)
 * @param {Array} informeCurricular - Información curricular del usuario
 * @param {String} asignaturaObjetivo - Asignatura a buscar relaciones
 * @returns {Array} - Array de asignaturas relacionadas
 */
export function obtenerAsignaturasRelacionadas(informeCurricular, asignaturaObjetivo) {
    if (!informeCurricular || !asignaturaObjetivo) return [];

    const relacionadas = [];
    
    // Buscar asignaturas con palabras clave similares
    const palabrasClave = extraerPalabrasClave(asignaturaObjetivo);
    
    informeCurricular.forEach(info => {
        if (info.asignatura !== asignaturaObjetivo) {
            const palabrasAsignatura = extraerPalabrasClave(info.asignatura);
            const overlap = calcularOverlap(palabrasClave, palabrasAsignatura);
            
            if (overlap > 0.3) { // 30% de similitud mínima
                relacionadas.push(info.asignatura);
            }
        }
    });

    return relacionadas;
}

/**
 * Extrae palabras clave de un texto (elimina artículos y preposiciones)
 * @param {String} texto - Texto a procesar
 * @returns {Array} - Array de palabras clave
 */
function extraerPalabrasClave(texto) {
    if (!texto) return [];
    
    const stopWords = ['de', 'del', 'la', 'el', 'los', 'las', 'a', 'ante', 'con', 'para', 'por', 'y', 'e', 'o', 'u'];
    
    return texto
        .toLowerCase()
        .split(/\s+/)
        .filter(palabra => !stopWords.includes(palabra) && palabra.length > 2);
}

/**
 * Calcula el boost factor para un apunte según condiciones especiales
 * @param {Object} apunte - Objeto apunte
 * @param {Object} usuario - Objeto perfil académico del usuario
 * @returns {Number} - Factor multiplicador [0.5, 2.0]
 */
export function calcularBoostFactor(apunte, usuario) {
    let boost = 1.0;

    // Boost si el apunte es de asignatura cursante actual
    if (usuario.asignaturasCursantes.includes(apunte.asignatura)) {
        boost *= 1.5;
    }

    // Boost si el usuario tiene preferencia fuerte de método (solo 1 método)
    if (usuario.metodosEstudiosPreferidos.length === 1) {
        const metodosCompatibles = MAPEO_TIPO_METODO[apunte.tipoApunte] || [];
        const tieneMatch = usuario.metodosEstudiosPreferidos.some(metodo =>
            metodosCompatibles.some(compatible => sonSimilares(metodo, compatible))
        );
        if (tieneMatch) boost *= 1.3;
    }

    // Boost si hay match en etiquetas con asignaturas de interés
    if (apunte.etiquetas && apunte.etiquetas.length > 0) {
        const matchEtiquetas = apunte.etiquetas.some(etiqueta =>
            usuario.asignaturasInteres.some(interes => sonSimilares(etiqueta, interes))
        );
        if (matchEtiquetas) boost *= 1.2;
    }

    // Boost si el apunte tiene comentarios (indica engagement)
    if (apunte.comentarios && apunte.comentarios.length > 0) {
        boost *= 1.15;
    }

    return Math.min(boost, 2.0); // Cap máximo de 2.0
}

/**
 * Calcula penalizaciones para un apunte
 * @param {Object} apunte - Objeto apunte
 * @param {Object} usuario - Objeto perfil académico del usuario
 * @returns {Number} - Factor multiplicador [0.1, 1.0]
 */
export function calcularPenalizacion(apunte, usuario) {
    let penalizacion = 1.0;

    // Penalización severa si no está activo
    if (apunte.estado !== 'Activo') {
        penalizacion *= 0.1;
    }

    // Penalización si ya fue valorado por el usuario
    const yaValorado = usuario.apuntesValorados.some(
        v => v.apunteID.toString() === apunte._id.toString()
    );
    if (yaValorado) {
        penalizacion *= 0.3;
    }

    // Penalización si ya fue descargado
    if (usuario.apuntesDescargadosIDs && usuario.apuntesDescargadosIDs.some(
        id => id.toString() === apunte._id.toString()
    )) {
        penalizacion *= 0.4;
    }

    // Penalización si tiene valoración baja pero muchas descargas (posible clickbait)
    if (apunte.valoracion.promedioValoracion < 3.0 && 
        apunte.descargas > 50 && 
        apunte.valoracion.cantidadValoraciones > 10) {
        penalizacion *= 0.6;
    }

    // Penalización si es de asignatura completamente ajena
    const esRelevante = usuario.asignaturasCursantes.includes(apunte.asignatura) ||
                        usuario.asignaturasInteres.includes(apunte.asignatura);
    
    if (!esRelevante) {
        const relacionadas = obtenerAsignaturasRelacionadas(usuario.informeCurricular, apunte.asignatura);
        if (relacionadas.length === 0) {
            penalizacion *= 0.7;
        }
    }

    return Math.max(penalizacion, 0.1); // Mínimo de 0.1
}

/**
 * Aplica diversificación a un array de apuntes con score
 * @param {Array} apuntesConScore - Array de objetos {apunte, score, explicacion}
 * @param {Object} config - Configuración de diversidad
 * @returns {Array} - Array diversificado
 */
export function aplicarDiversificacion(apuntesConScore, config = CONFIG_DIVERSIDAD) {
    if (!apuntesConScore || apuntesConScore.length === 0) return [];

    const resultado = [];
    const contadorAsignaturas = {};
    const tiposUsados = new Set();

    // Ordenar por score descendente
    const ordenados = [...apuntesConScore].sort((a, b) => b.score - a.score);

    // Calcular cuántos apuntes de serendipity incluir
    const cantidadTotal = ordenados.length;
    const cantidadSerendipity = Math.floor(cantidadTotal * config.porcentajeSerendipity);
    
    // Separar apuntes de alta relevancia y de exploración
    const altaRelevancia = ordenados.slice(0, cantidadTotal - cantidadSerendipity);
    const exploracion = ordenados.slice(cantidadTotal - cantidadSerendipity);

    // Procesar apuntes de alta relevancia con restricciones de diversidad
    for (const item of altaRelevancia) {
        const asignatura = item.apunte.asignatura;
        const tipo = item.apunte.tipoApunte;

        // Verificar límite por asignatura
        if ((contadorAsignaturas[asignatura] || 0) < config.maxPorAsignatura) {
            // Verificar diversidad de tipos si está habilitada
            if (!config.diversidadTipos || !tiposUsados.has(tipo) || resultado.length > 5) {
                resultado.push(item);
                contadorAsignaturas[asignatura] = (contadorAsignaturas[asignatura] || 0) + 1;
                tiposUsados.add(tipo);
            }
        }
    }

    // Agregar apuntes de exploración sin restricciones
    resultado.push(...exploracion);

    return resultado;
}
