const mongoose = require("mongoose");

const carretSchema = new mongoose.Schema({
  // USUARI 1..1 CARRET: unique = cada usuario tiene un solo carrito
  usuari: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuari",
    required: true,
    unique: true,
  },
  // CARRET N..N PRODUCTE: lista de productos con su cantidad
  productes: [
    {
      producte: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producte",
        required: true,
      },
      quantitat: { type: Number, min: 1, max: 99, default: 1 },
    },
  ],
  total: { type: Number, default: 0, min: 0 },
  dataActualitzacio: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Carret", carretSchema);
