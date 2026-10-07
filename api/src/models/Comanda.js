const mongoose = require("mongoose");

const comandaSchema = new mongoose.Schema({
  // CARRET 1..N COMANDA: guardamos el _id del carrito del que sale el pedido
  carret: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carret",
    required: true,
  },
  // COMANDA N..N PRODUCTE: lista de productos con su cantidad y el precio pagado
  productes: [
    {
      producte: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producte",
        required: true,
      },
      quantitat: { type: Number, required: true, min: 1 },
      preu: { type: Number, required: true, min: 0 },
    },
  ],
  data: { type: Date, default: Date.now },
  estat: {
    type: String,
    enum: ["pendent", "pagada", "enviada", "entregada", "cancel·lada"],
    default: "pendent",
  },
  total: { type: Number, required: true, min: 0 },
  adrecaEnviament: { type: String, required: true },
});

module.exports = mongoose.model("Comanda", comandaSchema);
