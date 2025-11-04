import axios from 'axios';

export async function crearApunteService(apunteData, file) {
    try {
        const formData = new FormData();
        
        formData.append('archivo', file);
        formData.append('nombre', apunteData.nombre);
        formData.append('descripcion', apunteData.descripcion);
        formData.append('asignatura', apunteData.asignatura);
        formData.append('tipoApunte', apunteData.tipoApunte);
        formData.append('fechaSubida', apunteData.fechaSubida);
        formData.append('autorSubida', apunteData.autorSubida);
        formData.append('rutAutorSubida', apunteData.rutAutorSubida);
        
        if (apunteData.autores && apunteData.autores.length > 0) {
            apunteData.autores.forEach(autor => {
                formData.append('autores[]', autor);
            });
        }
        
        if (apunteData.etiquetas && apunteData.etiquetas.length > 0) {
            apunteData.etiquetas.forEach(etiqueta => {
                formData.append('etiquetas[]', etiqueta);
            });
        }
    
        const response = await axios.post('api/apuntes/', formData);
        
        return response.data;
    } catch (error) {
        console.error("Error al crear apunte:", error);
        throw error;
    }
}

