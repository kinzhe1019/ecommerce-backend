// Importamos Mongoose
const mongoose = require("mongoose");

// Esquema (el "molde") de una categoría
const categorySchema = new mongoose.Schema(
  {
    // Nombre: obligatorio y de 3 caracteres como mínimo
    // (el texto de al lado es el mensaje de error que saldrá)
    name: {
      type: String,
      required: [true, "El nom és obligatori"],
      minlength: [3, "El nom ha de tenir mínim 3 caràcters"],
      trim: true,
    },
    // Slug: el nombre "para URLs" (ej: "roba"). Obligatorio y único.
    // Ojo: unique no es una validación de Mongoose, es un índice de MongoDB.
    // Si se repite, MongoDB da el error 11000 (lo tratamos en errorHandler.js)
    slug: {
      type: String,
      required: [true, "L'slug és obligatori"],
      unique: true,
      lowercase: true, // lo guarda en minúsculas
      trim: true, // quita los espacios de delante y de detrás
    },
    // Descripción: opcional, como máximo 500 caracteres
    description: {
      type: String,
      maxlength: [500, "La descripció pot tenir com a màxim 500 caràcters"],
    },
    // Activa: si no se envía, vale true
    active: { type: Boolean, default: true },
  },
  // timestamps: Mongoose añade solo los campos createdAt y updatedAt
  { timestamps: true },
);

// Creamos el modelo "Category" a partir del esquema y lo exportamos.
// En MongoDB se guarda en la colección "categories"
module.exports = mongoose.model("Category", categorySchema);
