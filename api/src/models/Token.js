// MODELO DE TOKENS: aquí guardamos los refresh tokens que damos a los usuarios.
// Así el servidor sabe cuáles valen y los puede anular (revocar) cuando quiera

// Importamos Mongoose
const mongoose = require("mongoose");

// Esquema (el "molde") de un refresh token
const tokenSchema = new mongoose.Schema(
  {
    // Usuario dueño del token: guardamos su _id (un usuario puede tener varios tokens)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ese _id es de un documento del modelo User
      required: true,
    },
    // El refresh token: un texto aleatorio muy largo.
    // unique: no puede haber 2 iguales (y crea un índice para buscarlo rápido)
    token: { type: String, required: true, unique: true },
    // Fecha en la que caduca (7 días después de crearlo)
    expiresAt: { type: Date, required: true },
    // Revocado: false = se puede usar, true = ya no vale
    // (porque ya se usó para renovar o porque el usuario hizo logout)
    revoked: { type: Boolean, default: false },
  },
  // timestamps: Mongoose añade solo createdAt y updatedAt
  { timestamps: true },
);

// Creamos el modelo "Token" y lo exportamos.
// En MongoDB se guarda en la colección "tokens"
module.exports = mongoose.model("Token", tokenSchema);