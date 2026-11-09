// SERVICIO DE TOKENS: crea los tokens, guarda los refresh tokens en MongoDB,
// los renueva (rotación) y detecta si alguien usa otra vez uno que ya se usó

// crypto viene con Node (no hay que instalarlo): lo usamos para crear texto aleatorio
const crypto = require("crypto");
// jsonwebtoken crea los access tokens (JWT)
const jwt = require("jsonwebtoken");
// Importamos los modelos Token y User
const Token = require("../models/Token");
const User = require("../models/User");

// ACCESS TOKEN: un JWT con el id y el rol del usuario que caduca en 15 minutos.
// Se firma con la clave secreta del .env
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }, // dura poco: si lo roban, solo sirve 15 minutos
  );
};

// REFRESH TOKEN: un texto aleatorio que dura 7 días.
// Lo guardamos en MongoDB con su usuario y su fecha de caducidad
const generateRefreshToken = async (user) => {
  // 40 bytes aleatorios escritos en hexadecimal = 80 letras y números
  const refreshToken = crypto.randomBytes(40).toString("hex");
  // Ahora + 7 días (en milisegundos: 7 días × 24 h × 60 min × 60 s × 1000 ms)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  // Lo guardamos en la colección tokens (revoked es false por defecto)
  await Token.create({
    user: user._id,
    token: refreshToken,
    expiresAt: expiresAt,
  });
  return refreshToken;
};

// Crea los 2 tokens a la vez (se usa en el registro, en el login y al renovar)
const generateTokens = async (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);
  return { accessToken: accessToken, refreshToken: refreshToken };
};

// Comprueba que el refresh token llega y que es texto. Si no, error 422.
// (Así nadie puede enviar un objeto raro como { "$ne": null } para engañar a MongoDB)
const checkRefreshToken = (refreshToken) => {
  if (typeof refreshToken !== "string") {
    const error = new Error("Cal enviar el refreshToken");
    error.status = 422;
    error.code = "VALIDATION_ERROR";
    throw error;
  }
};

// RENOVAR CON ROTACIÓN: recibe un refresh token y, si vale,
// lo anula y devuelve 2 tokens nuevos
const refreshTokens = async (refreshToken) => {
  // 1. Comprobamos que llega
  checkRefreshToken(refreshToken);
  // 2. Lo buscamos en la base de datos
  const savedToken = await Token.findOne({ token: refreshToken });

  // 3. Si no existe o ya ha caducado → 401
  if (!savedToken || savedToken.expiresAt < new Date()) {
    const error = new Error("Refresh token no vàlid o caducat");
    error.status = 401;
    error.code = "INVALID_TOKEN";
    throw error;
  }

  // 4. DETECCIÓN DE REUTILIZACIÓN: si ya estaba revocado, alguien lo está
  // usando por segunda vez (puede que lo hayan robado). Por seguridad anulamos
  // TODOS los refresh tokens de ese usuario: tendrá que volver a hacer login
  if (savedToken.revoked) {
    await Token.updateMany({ user: savedToken.user }, { revoked: true });
    const error = new Error(
      "Aquest refresh token ja s'havia fet servir. S'han tancat totes les sessions",
    );
    error.status = 401;
    error.code = "TOKEN_REUSED";
    throw error;
  }

  // 5. Buscamos el usuario (necesitamos su rol para el access token nuevo).
  // Si ya no existe o está desactivado → 401
  const user = await User.findById(savedToken.user);
  if (!user || !user.active) {
    const error = new Error("Refresh token no vàlid o caducat");
    error.status = 401;
    error.code = "INVALID_TOKEN";
    throw error;
  }

  // 6. ROTACIÓN: el token que nos han enviado deja de valer...
  savedToken.revoked = true;
  await savedToken.save();
  // ...y creamos 2 tokens nuevos
  return await generateTokens(user);
};

// LOGOUT: anula el refresh token para que no se pueda usar más
const revokeRefreshToken = async (refreshToken) => {
  checkRefreshToken(refreshToken);
  await Token.updateOne({ token: refreshToken }, { revoked: true });
};

// Exportamos las funciones que usan el userService y el userController
module.exports = {
  generateTokens,
  refreshTokens,
  revokeRefreshToken,
};
