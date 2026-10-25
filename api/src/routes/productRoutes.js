// Importamos Express
const express = require("express");
// Creamos un router: un "mini servidor" solo para las rutas de productos
const router = express.Router();
// Importamos el controlador, que tiene la función que se ejecuta en cada ruta
const productController = require("../controllers/productController");

// Todas estas rutas empiezan por /api/products (se monta en index.js)
// :id es un hueco en la URL; su valor llega al controlador en req.params.id

// GET /api/products → lista todos los productos
router.get("/", productController.getAllProducts);
// GET /api/products/:id → busca un producto por su id
router.get("/:id", productController.getProductById);
// POST /api/products → crea un producto con los datos del body
router.post("/", productController.createProduct);
// PUT /api/products/:id → modifica un producto
router.put("/:id", productController.updateProduct);
// DELETE /api/products/:id → borra un producto
router.delete("/:id", productController.deleteProduct);

// Exportamos el router para montarlo en index.js
module.exports = router;
