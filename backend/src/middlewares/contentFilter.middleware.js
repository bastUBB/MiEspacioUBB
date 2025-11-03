import { validarContenidoObjeto } from '../helpers/contentFilter.helper.js';
import { handleErrorClient } from '../handlers/responseHandlers.js';

export function validateContent(camposAValidar = null) {
    return (req, res, next) => {
        try {
            const { esValido, camposConProblemas } = validarContenidoObjeto(
                req.body, 
                camposAValidar
            );

            if (!esValido) {
                const camposProblematicos = Object.keys(camposConProblemas);
                const primerCampo = camposProblematicos[0];
                const palabrasEncontradas = camposConProblemas[primerCampo].palabrasProhibidas;

                return handleErrorClient(
                    res,
                    400,
                    `El campo "${primerCampo}" contiene contenido inapropiado. Por favor, revisa tu texto y evita usar lenguaje ofensivo.`
                );
            }

            next();
        } catch (error) {
            console.error('Error en middleware de validación de contenido:', error);
            // En caso de error, permitir que continúe (fail-open para no bloquear el servicio)
            next();
        }
    };
}

export function validateQueryContent(paramsAValidar = null) {
    return (req, res, next) => {
        try {
            const { esValido, camposConProblemas } = validarContenidoObjeto(
                req.query, 
                paramsAValidar
            );

            if (!esValido) {
                const camposProblematicos = Object.keys(camposConProblemas);
                const primerCampo = camposProblematicos[0];

                console.log('Contenido inapropiado en query params:', {
                    usuario: req.user?.email || 'Anónimo',
                    campos: camposProblematicos,
                    ip: req.ip
                });

                return handleErrorClient(
                    res,
                    400,
                    `El parámetro "${primerCampo}" contiene contenido inapropiado.`
                );
            }

            next();
        } catch (error) {
            console.error('Error en validación de query params:', error);
            next();
        }
    };
}
