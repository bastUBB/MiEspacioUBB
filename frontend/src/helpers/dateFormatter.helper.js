/**
 * Convierte una fecha en formato DD-MM-YYYY a un objeto Date
 * @param {string} dateString - Fecha en formato DD-MM-YYYY
 * @returns {Date|null} Objeto Date o null si la fecha es inválida
 */
export const parseCustomDate = (dateString) => {
  if (!dateString) return null;
  
  // Si la fecha ya viene en formato válido para Date, retornarla
  const standardDate = new Date(dateString);
  if (!isNaN(standardDate.getTime())) {
    return standardDate;
  }
  
  // Parsear formato DD-MM-YYYY
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Los meses en JS son 0-indexed
    const year = parseInt(parts[2], 10);
    
    const date = new Date(year, month, day);
    
    // Validar que la fecha sea válida
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  return null;
};

/**
 * Formatea una fecha en formato DD-MM-YYYY a formato local español
 * @param {string} dateString - Fecha en formato DD-MM-YYYY
 * @returns {string} Fecha formateada o 'Fecha no disponible' si es inválida
 */
export const formatDateToLocal = (dateString) => {
  const date = parseCustomDate(dateString);
  
  if (!date) {
    return 'Fecha no disponible';
  }
  
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Formatea una fecha en formato DD-MM-YYYY a formato largo en español
 * @param {string} dateString - Fecha en formato DD-MM-YYYY
 * @returns {string} Fecha formateada o 'Fecha no disponible' si es inválida
 */
export const formatDateToLong = (dateString) => {
  const date = parseCustomDate(dateString);
  
  if (!date) {
    return 'Fecha no disponible';
  }
  
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};