// Importamos Mongoose
const mongoose = require("mongoose");

// Esquema (el "molde") de un usuario: qué campos tiene y qué reglas cumplen
const userSchema = new mongoose.Schema(
  {
    // Nombre: obligatorio y de 2 caracteres como mínimo
    // (el texto de al lado es el mensaje de error que saldrá)
    name: {
      type: String,
      required: [true, "El nom és obligatori"],
      minlength: [2, "El nom ha de tenir mínim 2 caràcters"],
      trim: true, // quita los espacios de delante y de detrás
    },
    // Email: obligatorio, único (índice) y con forma de email: algo@algo.algo
    email: {
      type: String,
      required: [true, "L'email és obligatori"],
      unique: true, // no puede haber 2 iguales (si se repite → error 409)
      lowercase: true, // lo guarda en minúsculas
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Format incorrecte"],
    },
    // Hash de la contraseña (NUNCA la contraseña en texto).
    // select: false → cuando buscamos usuarios, este campo no se devuelve
    passwordHash: { type: String, required: true, select: false },
    // Rol: solo "client" o "admin". Si no se envía, es "client"
    role: { type: String, enum: ["client", "admin"], default: "client" },
    // Activo: true por defecto. Al "borrar" un usuario lo ponemos a false
    active: { type: Boolean, default: true },
  },
  // timestamps: Mongoose añade solo createdAt y updatedAt
  { timestamps: true },
);

// Creamos el modelo "User" a partir del esquema y lo exportamos.
// En MongoDB se guarda en la colección "users" (Mongoose la pone en minúsculas y en plural)
module.exports = mongoose.model("User", userSchema);
