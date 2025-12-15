import Asignatura from "../models/asignatura.model.js"

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

export async function getAsignaturaService(query) {
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

export async function obtenerCantidadAsignaturasService() {
    try {
        const cantidadAsignaturas = await Asignatura.countDocuments();

        return [cantidadAsignaturas, null];
    } catch (error) {
        console.error('Error al obtener la cantidad de asignaturas:', error);
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
    try {
        const { codigo: codigoQuery } = query;

        const existingAsignatura = await Asignatura.findOne({ codigo: codigoQuery });

        if (!existingAsignatura) return [null, 'Asignatura no encontrada'];

        const deletedAsignatura = await Asignatura.deleteOne({ codigo: codigoQuery });

        if (!deletedAsignatura) return [null, 'Error al eliminar la asignatura'];

        return [deletedAsignatura, null];
    } catch (error) {
        console.error('Error al eliminar la asignatura:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function getUnidadesAsignaturaService(query) {
    try {
        const { codigo: codigoQuery } = query;

        const existingAsignatura = await Asignatura.findOne({ codigo: codigoQuery });

        if (!existingAsignatura) return [null, 'Asignatura no encontrada'];

        return [existingAsignatura.unidades, null];
    } catch (error) {
        console.error('Error al obtener las unidades de la asignatura:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function getAsignaturasSemestreActualService(query) {
    try {
        const { semestreActual } = query;

        const asignaturas = await Asignatura.find({ semestre: semestreActual });

        if (!asignaturas || asignaturas.length === 0) return [null, 'No hay asignaturas para el semestre actual'];

        return [asignaturas, null];
    } catch (error) {
        console.error('Error al obtener las asignaturas del semestre actual:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function agregarEtiquetasAsignaturaService(codigoAsignatura, etiquetas) {
    try {
        const existingAsignatura = await Asignatura.findOne({ codigo: codigoAsignatura });

        if (!existingAsignatura) return [null, 'Asignatura no encontrada'];

        //verificar si ya existe esta etiqueta
        const etiquetasExistentes = existingAsignatura.etiquetasAñadidas;

        const etiquetasNuevas = etiquetas.filter((etiqueta) => !etiquetasExistentes.includes(etiqueta));

        if (etiquetasNuevas.length === 0) return [0, 'No hay etiquetas nuevas para agregar'];

        existingAsignatura.etiquetasAñadidas.push(...etiquetasNuevas);

        const updatedAsignatura = await existingAsignatura.save();

        if (!updatedAsignatura) return [null, 'Error al agregar las etiquetas'];

        return [updatedAsignatura, null];
    } catch (error) {
        console.error('Error al agregar las etiquetas:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function sugerirEtiquetasAsignaturaService(codigoAsignatura) {
    try {
        // First, get the asignatura to get its name
        const existingAsignatura = await Asignatura.findOne({ codigo: codigoAsignatura });

        if (!existingAsignatura) return [null, 'Asignatura no encontrada'];

        // Import Apunte model dynamically to avoid circular dependencies
        const Apunte = (await import("../models/apunte.model.js")).default;

        // Find all apuntes for this subject and get unique tags
        const apuntes = await Apunte.find({ asignatura: existingAsignatura.nombre });

        // Extract all tags and get unique ones
        const allTags = apuntes.flatMap(apunte => apunte.etiquetas || []);
        const uniqueTags = [...new Set(allTags.map(tag => tag.toLowerCase()))];

        return [uniqueTags, null];
    } catch (error) {
        console.error('Error al obtener las etiquetas de la asignatura:', error);
        return [null, 'Error interno del servidor'];
    }
}
