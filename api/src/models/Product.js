// Importamos Mongoose
const mongoose = require("mongoose");

// Esquema (el "molde") de un producto: qué campos tiene y qué reglas cumplen
const productSchema = new mongoose.Schema({
  // Nombre: texto obligatorio
  name: { type: String, required: true },
  // Descripción: texto opcional
  description: { type: String },
  // Precio: número obligatorio que no puede ser negativo
  price: { type: Number, required: true, min: 0 },
  // Stock: número que vale 0 si no se envía, no negativo y entero
  stock: {
    type: Number,
    default: 0,
    min: 0,
    // Validación custom: el stock tiene que ser un número entero
    validate: {
      // Devuelve true si es entero (válido) o false si no lo es (error)
      validator: (value) => Number.isInteger(value),
      // Mensaje de error cuando no es entero
      message: "L'estoc ha de ser un número enter",
    },
  },
  // Imagen: texto opcional (la URL de la foto)
  image: { type: String },
  // CATEGORY 1..N PRODUCT: guardamos el _id de la categoría
  category: {
    // ObjectId = el _id de otro documento
    type: mongoose.Schema.Types.ObjectId,
    // ref: ese _id es de un documento del modelo Category (sirve para populate)
    ref: "Category",
    required: true,
  },
});

// Índice para buscar rápido los productos de una categoría (1 = orden ascendente)
productSchema.index({ category: 1 });

// Creamos el modelo "Product" a partir del esquema y lo exportamos
module.exports = mongoose.model("Product", productSchema);
