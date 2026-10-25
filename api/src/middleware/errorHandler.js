// Middleware GLOBAL de errores.
// Express sabe que es de errores porque tiene 4 parámetros (err, req, res, next).
// Los controladores no responden los errores: hacen next(error) y llegan aquí.
// Aquí decidimos el código HTTP y respondemos siempre con el mismo formato:
// { success: false, error: { code, message, details } }
const errorHandler = (err, req, res, next) => {
  // 1. Validaciones de Mongoose (required, minlength, match, enum...) → 422
  if (err.name === "ValidationError") {
    // Hacemos una lista con el campo y el mensaje de cada error
    const details = [];
    for (const field in err.errors) {
      details.push({ field: field, message: err.errors[field].message });
    }
    return res.status(422).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Les dades no són vàlides",
        details: details,
      },
    });
  }

  // 2. ID con formato incorrecto (ej: /api/users/123) → 400
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: { code: "INVALID_ID", message: "L'identificador no és vàlid" },
    });
  }

  // 3. Valor repetido en un campo unique (email, slug) → 409
  // MongoDB avisa con el código 11000
  if (err.code === 11000) {
    // keyValue es tipo { email: "anna@mail.com" }: cogemos el nombre del campo
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: {
        code: "DUPLICATE_KEY",
        message: "Ja existeix un registre amb aquest " + field,
        details: [{ field: field, message: "Valor duplicat" }],
      },
    });
  }

  // 4. El JSON del body está mal escrito (falta una coma, comillas...) → 400
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_JSON",
        message: "El JSON del body no és correcte",
      },
    });
  }

  // 5. Errores que creamos nosotros en los controladores y servicios
  // (404 no encontrado, 400 campo no permitido, 422 contraseña corta...)
  if (err.status) {
    return res.status(err.status).json({
      success: false,
      error: { code: err.code, message: err.message, details: err.details },
    });
  }

  // 6. Cualquier otro error → 500.
  // Lo enseñamos en la consola (para nosotros), pero al cliente
  // no le damos detalles internos
  console.error(err);
  res.status(500).json({
    success: false,
    error: { code: "INTERNAL_ERROR", message: "Error intern del servidor" },
  });
};

// Lo exportamos para usarlo en index.js
module.exports = errorHandler;
