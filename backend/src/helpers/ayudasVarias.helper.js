import path from 'path';
import moment from "moment";

export const diaActual = moment().format("DD-MM-YYYY");

export const fechaActual = moment().format("DD-MM-YYYY-HH:mm");

export function generarNombreArchivoForMinIO(metadata) {
    const extension = path.extname(metadata.nombreOriginal);
    const nombreSinExtension = path.basename(metadata.nombreOriginal, extension);
    return `${nombreSinExtension}-${metadata.autorSubida}-${metadata.fechaActual}.${extension}`;
}

