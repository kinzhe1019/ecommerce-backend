// ARCHIVO PRINCIPAL DE LA API: es el que se ejecuta con npm run dev.
// Paso a paso: carga el .env, crea el servidor, conecta con MongoDB,
// monta las rutas, pone el control de errores y se queda escuchando

// Carga las variables del archivo .env (MONGO_URI, PORT, JWT_SECRET) en process.env
require("dotenv").config();
// Importamos Express, la librería para crear el servidor
const express = require("express");
// Importamos la función que conecta con MongoDB (está en config/db.js)
const connectDB = require("./config/db");
// Importamos las rutas de productos, categorías y usuarios
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");
// Importamos el middleware global de errores
const errorHandler = require("./middleware/errorHandler");
// Creamos el servidor
const app = express();
// Para que el servidor entienda el JSON que llega en el body (lo pone en req.body)
app.use(express.json());

// Nos conectamos a la base de datos
connectDB();

// Ruta de prueba: si entras en http://localhost:3000/ responde este texto
app.get("/", (req, res) => res.send("API Ecommerce en marxa!"));

// Montamos las rutas de cada recurso con su prefijo.
// Ej: todo lo que empieza por /api/products lo lleva productRoutes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);

// El middleware de errores va SIEMPRE al final, después de todas las rutas
app.use(errorHandler);

// Puerto: el del .env o, si no hay, el 3000
const PORT = process.env.PORT || 3000;
// Encendemos el servidor y escribimos un mensaje cuando está listo
app.listen(PORT, () => console.log(`Servidor escoltant al port ${PORT}`));
