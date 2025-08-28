import { exist } from "joi";
import Asignatura from "../models/asignaturas.model.js"

export async function createAsignaturaService(dataAsignatura) {
    try {

        const { codigo, prerrequisitos } = dataAsignatura;

        const existingAsignatura = await Asignatura.findOne({ codigo: codigo });

        if (existingAsignatura) return [null, 'El código de la asignatura ya existe'];

        //verificar que los prerrequisitos pertenecen a asignaturas existentes
        if (prerrequisitos && prerrequisitos.length > 0) {

            const existingPrerrequisitos = await Asignatura.find({ nombre: { $in: prerrequisitos } });

            if (existingPrerrequisitos.length !== prerrequisitos.length) return [null, 'Uno o más prerrequisitos no pertenecen a asignaturas existentes'];
        }

        const newAsignatura = new Asignatura(dataAsignatura);

        if (!newAsignatura) return [null, 'Error al crear la asignatura'];

        const asignaturaSaved = await newAsignatura.save();

        return [asignaturaSaved, null];
    } catch (error) {
        console.error('Error al crear la asignatura:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function getAsignaturaService(query){
    try {
        const { codigo: codigoQuery } = query;

        const existingAsignatura = await Asignatura.findOne({ codigo: codigoQuery });

        if (!existingAsignatura) return [null, 'Asignatura no encontrada'];

        return [existingAsignatura, null];
    } catch (error) {
        console.error('Error al obtener la asignatura:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function getAllAsignaturasService() {
    try {
        const asignaturas = await Asignatura.find();

        if (!asignaturas || asignaturas.length === 0) return [null, 'No hay asignaturas registradas'];

        return [asignaturas, null];
    } catch (error) {
        console.error('Error al obtener las asignaturas:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function updateAsignaturaService(query, body) {
    try {
        const { codigo: codigoQuery } = query; 

        const { codigo: nuevoCodigo, prerrequisitos: nuevosPrerrequisitos } = body; 

        const existingAsignatura = await Asignatura.findOne({ codigo: codigoQuery });

        if (!existingAsignatura) return [null, 'Asignatura que desea actualizar no existe'];

        if (nuevoCodigo && nuevoCodigo !== existingAsignatura.codigo) {
            
            const existingCodigo = await Asignatura.findOne({ codigo: nuevoCodigo });

            if (existingCodigo) return [null, 'El código al que desea actualizar ya existe en otra asignatura'];
        }

        if (nuevosPrerrequisitos && nuevosPrerrequisitos.length > 0) {

            const existingPrerrequisitos = await Asignatura.find({ nombre: { $in: nuevosPrerrequisitos } });

            if (existingPrerrequisitos.length !== nuevosPrerrequisitos.length) return [null, 'Uno o más prerrequisitos no pertenecen a asignaturas existentes'];
        }

        const asignaturaUpdated = await Asignatura.findOneAndUpdate(
            { _id: existingAsignatura._id },
            body,
            { new: true }
        );

        if (!asignaturaUpdated) return [null, 'Error al actualizar la asignatura'];
        
        return [asignaturaUpdated, null];
    } catch (error) {
        console.error('Error al actualizar la asignatura:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function deleteAsignaturaService(query) {
    try{
        const { codigo: codigoQuery } = query;  

        const existingAsignatura = await Asignatura.findOne({ codigo: codigoQuery });

        if (!existingAsignatura) return [null, 'Asignatura no encontrada'];

        const deletedAsignatura = await Asignatura.deleteOne({ codigo: codigoQuery });

        if (!deletedAsignatura) return [null, 'Error al eliminar la asignatura'];

        return [deletedAsignatura, null];
    }catch(error){ 
        console.error('Error al eliminar la asignatura:', error);
        return [null, 'Error interno del servidor'];
    }
}