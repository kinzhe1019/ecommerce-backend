const mongoose = require("mongoose");

const usuariSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /.+@.+\..+/ },
  password: { type: String, required: true, minlength: 8 },
  rol: { type: String, enum: ["client", "admin"], default: "client" },
  adreca: { type: String },
});

module.exports = mongoose.model("Usuari", usuariSchema);
