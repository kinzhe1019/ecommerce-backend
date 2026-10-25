// Importamos Mongoose
const mongoose = require("mongoose");

// Esquema (el "molde") de un usuario
const userSchema = new mongoose.Schema(
  {
    // Nombre: obligatorio y de 2 caracteres como mínimo
    name: {
      type: String,
      required: [true, "El nom és obligatori"],
      minlength: [2, "El nom ha de tenir mínim 2 caràcters"],
      trim: true,
    },
    // Email: obligatorio, único (índice) y con forma de email: algo@algo.algo
    email: {
      type: String,
      required: [true, "L'email és obligatori"],
      unique: true,
      lowercase: true,
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

// Creamos el modelo "User" a partir del esquema y lo exportamos
module.exports = mongoose.model("User", userSchema);
