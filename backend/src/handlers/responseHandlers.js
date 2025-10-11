export function handleSuccess(res, statusCode, message, data = {}) {
  return res.status(statusCode).json({
    status: "Success",
    message,
    data,
  });
}

export function handleErrorClient(res, statusCode, message, details = {}) {
  return res.status(statusCode).json({
    status: "Client error",
    message,
    details
  });
}

export function handleErrorServer(res, statusCode, message) {
  return res.status(statusCode).json({
    status: "Server error",
    message,
  });
}

export function handleFileNotProvided(res) {
  return res.status(400).json({
    status: "Client error",
    message: "No se ha proporcionado ningún archivo",
    details: {
      code: "FILE_NOT_PROVIDED",
      field: "file"
    }
  });
}

export function handleInvalidFileType(res, allowedTypes = ["PDF", "DOCX", "TXT"]) {
  return res.status(400).json({
    status: "Client error",
    message: `Tipo de archivo no permitido. Solo se permiten archivos ${allowedTypes.join(", ")}`,
    details: {
      code: "INVALID_FILE_TYPE",
      field: "file",
      allowedTypes
    }
  });
}

export function handleFileTooLarge(res, maxSizeMB) {
  return res.status(400).json({
    status: "Client error",
    message: `Archivo demasiado grande. Máximo permitido: ${maxSizeMB}MB`,
    details: {
      code: "FILE_TOO_LARGE",
      field: "file",
      maxSize: `${maxSizeMB}MB`
    }
  });
}

export function handleTooManyFiles(res) {
  return res.status(400).json({
    status: "Client error",
    message: "Solo se permite un archivo por request",
    details: {
      code: "TOO_MANY_FILES",
      field: "file",
      maxFiles: 1
    }
  });
}
