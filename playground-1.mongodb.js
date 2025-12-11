/* global use, db */
// MongoDB Playground - Actualizar asignaturas con campo etiquetasAñadidas
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('miespacioubb');

console.log('=== PASO 1: Actualizar todas las asignaturas con el campo etiquetasAñadidas ===');

// Agregar el campo etiquetasAñadidas a todas las asignaturas que no lo tienen
const resultAsignaturas = db.getCollection('asignaturas').updateMany(
    { etiquetasAñadidas: { $exists: false } },
    { $set: { etiquetasAñadidas: [] } }
);

console.log(`Asignaturas actualizadas: ${resultAsignaturas.modifiedCount}`);

console.log('\n=== PASO 2: Obtener etiquetas de apuntes de Álgebra Lineal ===');

// Buscar los apuntes de Álgebra Lineal
const apuntesAlgebra = db.getCollection('apuntes').find({
    asignatura: 'Álgebra Lineal'
}).toArray();

console.log(`Apuntes de Álgebra Lineal encontrados: ${apuntesAlgebra.length}`);

// Recolectar todas las etiquetas únicas de los apuntes
let todasEtiquetas = [];
apuntesAlgebra.forEach(apunte => {
    console.log(`- Apunte: ${apunte.nombre}`);
    console.log(`  Etiquetas: ${apunte.etiquetas.join(', ')}`);
    todasEtiquetas = todasEtiquetas.concat(apunte.etiquetas);
});

// Eliminar duplicados y convertir a minúsculas
const etiquetasUnicas = [...new Set(todasEtiquetas.map(e => e.toLowerCase()))];
console.log(`\nEtiquetas únicas: ${etiquetasUnicas.join(', ')}`);

console.log('\n=== PASO 3: Actualizar Álgebra Lineal con las etiquetas ===');

// Actualizar la asignatura Álgebra Lineal con las etiquetas
const resultAlgebra = db.getCollection('asignaturas').updateOne(
    { nombre: 'Álgebra Lineal' },
    { $set: { etiquetasAñadidas: etiquetasUnicas } }
);

console.log(`Álgebra Lineal actualizada: ${resultAlgebra.modifiedCount > 0 ? 'Sí' : 'No'}`);

console.log('\n=== VERIFICACIÓN ===');

// Verificar el resultado
const algebraActualizada = db.getCollection('asignaturas').findOne({ nombre: 'Álgebra Lineal' });
console.log('Álgebra Lineal ahora tiene las siguientes etiquetas:');
console.log(algebraActualizada.etiquetasAñadidas);

console.log('\n=== SCRIPT COMPLETADO ===');
