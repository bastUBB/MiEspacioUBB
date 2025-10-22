import fs from 'fs';
import path from 'path';
import Asignatura from '../models/asignatura.model.js';

const asignaturasPath = path.resolve('output/datosAsignaturas.json');
const asignaturasRaw = fs.readFileSync(asignaturasPath);
const asignaturasData = JSON.parse(asignaturasRaw);
const Asignaturas = asignaturasData.datos || asignaturasData || [];

async function createAsignaturas() {
    try {

        if (!Asignaturas || Asignaturas.length === 0) {
            console.log('No hay asignaturas en el JSON para crear.');
            return;
        }

        const asignaturasExistentes = await Asignatura.find({ codigo: { $in: Asignaturas.map(a => a.codigo) } });

        if (asignaturasExistentes.length > 0) {
            console.log('Algunas asignaturas iniciales ya existen en la base de datos.');
            return;
        }

        // mapear cada asignatura de asignaturasData y crearla en la base de datos
        const asignaturasPromises = Asignaturas.map(asignatura => {
            return Asignatura.create({
                nombre: asignatura.nombre,
                codigo: asignatura.codigo,
                creditos: asignatura.creditos,
                prerrequisitos: asignatura.prerrequisitos,
                semestre: asignatura.semestre,
                ambito: asignatura.ambito,
                area: asignatura.area
            });
        }
        );

        await Promise.all(asignaturasPromises);

        console.log('Asignaturas iniciales creadas exitosamente');

    } catch (error) {
        console.error('Error al crear asignaturas iniciales:', error.message);
    }
}

export async function initialSetup() {
    await createAsignaturas();
}

