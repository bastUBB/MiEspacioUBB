/**
 * Convierte una fecha en varios formatos a un objeto Date
 * @param {string|Date|Object} dateString - Fecha en varios formatos posibles
 * @returns {Date|null} Objeto Date o null si la fecha es inválida
 */
export const parseCustomDate = (dateString) => {
  if (!dateString) return null;

  // Si ya es un objeto Date válido
  if (dateString instanceof Date && !isNaN(dateString.getTime())) {
    return dateString;
  }

  // Convertir a string si no lo es
  let dateStr = String(dateString).trim();

  // Si está vacío o es "undefined" o "null"
  if (!dateStr || dateStr === 'undefined' || dateStr === 'null' || dateStr === '') {
    return null;
  }

  // Si contiene 'T', es formato ISO - usar parseo estándar
  if (dateStr.includes('T')) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) return date;
  }

  // Normalizar: convertir / a - para procesamiento uniforme
  const normalizedStr = dateStr.replace(/\//g, '-');

  // Intentar parsear formatos con guiones
  if (normalizedStr.includes('-')) {
    const parts = normalizedStr.split('-');

    // Formato DD-MM-YYYY-HH:mm (4 partes, usado por el backend para fechaAccion del historial)
    if (parts.length === 4) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      const timePart = parts[3]; // HH:mm

      if (!isNaN(day) && !isNaN(month) && !isNaN(year) && year > 1900 && year < 2100) {
        let hours = 0, minutes = 0;
        if (timePart && timePart.includes(':')) {
          const timeparts = timePart.split(':');
          hours = parseInt(timeparts[0], 10) || 0;
          minutes = parseInt(timeparts[1], 10) || 0;
        }
        const date = new Date(year, month - 1, day, hours, minutes);
        if (!isNaN(date.getTime())) return date;
      }
    }

    // Formato estándar con 3 partes (DD-MM-YYYY o YYYY-MM-DD)
    if (parts.length === 3) {
      const first = parseInt(parts[0], 10);
      const second = parseInt(parts[1], 10);
      const third = parseInt(parts[2], 10);

      // Verificar que todos sean números válidos
      if (isNaN(first) || isNaN(second) || isNaN(third)) {
        return null;
      }

      // Si el primer número tiene 4 dígitos, es YYYY-MM-DD
      if (parts[0].length === 4 && first > 1900 && first < 2100) {
        const date = new Date(first, second - 1, third);
        if (!isNaN(date.getTime())) return date;
      }
      // Si el tercer número tiene 4 dígitos, es DD-MM-YYYY
      else if (parts[2].length === 4 && third > 1900 && third < 2100) {
        const date = new Date(third, second - 1, first);
        if (!isNaN(date.getTime())) return date;
      }
      // Fallback: intentar determinar por valores
      else if (first > 31) {
        // Probablemente YYYY-MM-DD
        const date = new Date(first, second - 1, third);
        if (!isNaN(date.getTime())) return date;
      } else if (third > 31) {
        // Probablemente DD-MM-YYYY
        const date = new Date(third, second - 1, first);
        if (!isNaN(date.getTime())) return date;
      }
    }
  }

  // Intentar parseo estándar de JavaScript
  const standardDate = new Date(dateStr);
  if (!isNaN(standardDate.getTime())) {
    return standardDate;
  }

  // Si es un ObjectId de MongoDB (24 caracteres hexadecimales), extraer timestamp
  if (/^[a-f\d]{24}$/i.test(dateStr)) {
    const timestamp = parseInt(dateStr.substring(0, 8), 16) * 1000;
    const date = new Date(timestamp);
    if (!isNaN(date.getTime())) return date;
  }

  return null;
};

/**
 * Formatea una fecha en formato DD-MM-YYYY a formato local español
 * @param {string} dateString - Fecha en formato DD-MM-YYYY
 * @returns {string} Fecha formateada o 'Fecha no disponible' si es inválida
 */
export const formatDateToLocal = (dateString) => {
  try {
    const date = parseCustomDate(dateString);

    if (!date || isNaN(date.getTime())) {
      return 'Fecha no disponible';
    }

    const result = date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    // Si por alguna razón toLocaleDateString retorna 'Invalid Date', devolver mensaje amigable
    if (result === 'Invalid Date' || result.includes('Invalid')) {
      return 'Fecha no disponible';
    }

    return result;
  } catch {
    return 'Fecha no disponible';
  }
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