// Importamos Mongoose
const mongoose = require("mongoose");

// Esquema (el "molde") del carrito.
// De momento no tiene rutas ni controlador: se usará en próximas sesiones
const cartSchema = new mongoose.Schema({
  // USER 1..1 CART: unique = cada usuario tiene un solo carrito
  user: {
    // Guardamos el _id del usuario dueño del carrito
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ese _id es de un documento del modelo User
    required: true,
    unique: true,
  },
  // CART N..N PRODUCT: lista de productos con su cantidad
  // (los corchetes [ ] indican que es una lista)
  products: [
    {
      // El _id del producto que hay en el carrito
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      // Cantidad: de 1 a 99 (min y max). Si no se envía, es 1
      quantity: { type: Number, min: 1, max: 99, default: 1 },
    },
  ],
  // Total del carrito: 0 por defecto y no puede ser negativo
  total: { type: Number, default: 0, min: 0 },
  // Fecha de actualización: por defecto, la fecha y hora de ahora
  updatedAt: { type: Date, default: Date.now },
});

// Creamos el modelo "Cart" a partir del esquema y lo exportamos.
// En MongoDB se guarda en la colección "carts"
module.exports = mongoose.model("Cart", cartSchema);
