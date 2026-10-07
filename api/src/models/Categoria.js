const mongoose = require("mongoose");

const categoriaSchema = new mongoose.Schema({
  nom: { type: String, required: true, unique: true },
  descripcio: { type: String },
});

module.exports = mongoose.model("Categoria", categoriaSchema);
