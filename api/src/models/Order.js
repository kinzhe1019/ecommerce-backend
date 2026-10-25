// Importamos Mongoose
const mongoose = require("mongoose");

// Esquema (el "molde") del pedido
const orderSchema = new mongoose.Schema({
  // CART 1..N ORDER: guardamos el _id del carrito del que sale el pedido
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },
  // ORDER N..N PRODUCT: lista de productos con su cantidad y el precio pagado
  products: [
    {
      // El _id del producto comprado
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      // Cantidad: obligatoria, como mínimo 1
      quantity: { type: Number, required: true, min: 1 },
      // Precio en el momento de la compra (por si después cambia el del producto)
      price: { type: Number, required: true, min: 0 },
    },
  ],
  // Fecha del pedido: por defecto, la fecha y hora de ahora
  date: { type: Date, default: Date.now },
  // Estado: solo puede ser uno de estos valores (enum). Empieza como "pending"
  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  // Total: obligatorio y no puede ser negativo
  total: { type: Number, required: true, min: 0 },
  // Dirección de envío: obligatoria (sin ella no se puede enviar el pedido)
  shippingAddress: { type: String, required: true },
});

// Creamos el modelo "Order" a partir del esquema y lo exportamos
module.exports = mongoose.model("Order", orderSchema);
