require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes"); // Importamos las rutas
const app = express();
app.use(express.json());

connectDB();

app.get("/", (req, res) => res.send("API Ecommerce en marxa!"));

// Montamos las rutas de productos bajo el prefijo /api/products
app.use("/api/products", productRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escoltant al port ${PORT}`));
