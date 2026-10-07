const mongoose = require("mongoose");

const producteSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  descripcio: { type: String },
  preu: { type: Number, required: true, min: 0 },
  stock: {
    type: Number,
    default: 0,
    min: 0,
    // Validación custom: el stock tiene que ser un número entero
    validate: {
      validator: (valor) => Number.isInteger(valor),
      message: "L'estoc ha de ser un número enter",
    },
  },
  imatge: { type: String },
  // CATEGORIA 1..N PRODUCTE: guardamos el _id de la categoría
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
    required: true,
  },
});

// Índice para buscar rápido los productos de una categoría
producteSchema.index({ categoria: 1 });

module.exports = mongoose.model("Producte", producteSchema);
