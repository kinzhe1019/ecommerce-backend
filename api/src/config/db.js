// Importamos Mongoose, la librería para trabajar con MongoDB
const mongoose = require("mongoose");

// Función que conecta con MongoDB.
// Es async porque conectarse tarda un poco y hay que esperar (await)
const connectDB = async () => {
  try {
    // Nos conectamos con la dirección que hay en el .env
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connectat correctament");
  } catch (err) {
    // Si falla (Docker apagado, contraseña mal...) enseñamos el motivo
    console.error(err.message);
    // y paramos el programa, porque sin base de datos la API no sirve
    process.exit(1);
  }
};

// La exportamos para poder usarla en index.js
module.exports = connectDB;
