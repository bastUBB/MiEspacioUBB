import Apunte from '../models/apunte.model.js';
import User from '../models/user.model.js';
import { fechaActual } from '../helpers/ayudasVarias.helper.js';

export async function generarNombreArchivoForMinIO(metadata) {
    const extension = path.extname(metadata.nombreOriginal);
    const nombreSinExtension = path.basename(metadata.nombreOriginal, extension);
    return `${nombreSinExtension}-${autorSubida}-${fechaActual}.${extension}`;
}

export async function uploadApunteService(apunteData) {}

//TODO: La idea es mostrar todos los apuntes, y que el archivo correspondiente se llama de manera individual con la URL firmada
export async function getAllApuntesService(){}

export async function getApuntesRecommendations(){}

export async function