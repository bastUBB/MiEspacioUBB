import path from 'path';
import moment from "moment";

export const diaActual = moment().format("DD-MM-YYYY");

export const fechaActual = moment().format("DD-MM-YYYY-HH:mm");

export const normalizarNombres = (texto) => {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remover acentos
        .replace(/[^a-zA-Z0-9\s-]/g, "") // Remover caracteres especiales excepto espacios y guiones
        .replace(/\s+/g, '_') // Reemplazar espacios por guiones bajos
        .trim();
}

export function generarNombreArchivoForMinIO(metadataArchivo, body, abreviacionAsignatura) {
    const extension = path.extname(metadataArchivo.originalname);

    const nombreSinExtension = path.basename(metadataArchivo.originalname, extension);

    const autorNormalizado = normalizarNombres(body.autorSubida);

    const nombreArchivoNormalizado = normalizarNombres(nombreSinExtension);

    return `${abreviacionAsignatura}-${nombreArchivoNormalizado}-${autorNormalizado}-${diaActual}${extension}`;
}