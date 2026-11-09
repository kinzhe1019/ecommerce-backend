// MIDDLEWARE DE AUTENTICACIÓN: se pone delante de las rutas protegidas.
// Mira si la petición lleva un access token válido: si lo lleva deja pasar
// (next()) y si no, manda un error 401 al errorHandler

// jsonwebtoken tiene jwt.verify, que comprueba los tokens
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  // 1. El token llega en el header así → Authorization: Bearer eyJhbGci...
  const header = req.headers.authorization;
  // 2. Si no hay header o no empieza por "Bearer " → 401
  if (!header || !header.startsWith("Bearer ")) {
    const error = new Error("Cal enviar el token (Authorization: Bearer ...)");
    error.status = 401;
    error.code = "NO_TOKEN";
    return next(error);
  }
  // 3. Nos quedamos solo con el token: quitamos los 7 caracteres de "Bearer "
  const token = header.slice(7);
  try {
    // 4. jwt.verify comprueba la firma (que nadie lo haya cambiado) y que no
    // haya caducado. Si está bien devuelve lo de dentro: { id, role, iat, exp }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // 5. Guardamos el usuario en req para que lo use el controlador
    req.user = { id: payload.id, role: payload.role };
    // 6. Todo bien: pasamos a la siguiente función (el controlador)
    next();
  } catch (err) {
    // Si el token está caducado o manipulado, jwt.verify lanza un error → 401
    const error = new Error("Token no vàlid o caducat");
    error.status = 401;
    error.code = "INVALID_TOKEN";
    // Si es porque ha caducado, otro código: así el cliente sabe que
    // tiene que pedir uno nuevo con /refresh
    if (err.name === "TokenExpiredError") {
      error.code = "TOKEN_EXPIRED";
    }
    next(error);
  }
};

// Lo exportamos para usarlo en las rutas
module.exports = protect;
