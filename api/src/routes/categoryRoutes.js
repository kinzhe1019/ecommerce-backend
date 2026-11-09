// RUTAS DE CATEGORÍAS: dicen qué función del controlador se ejecuta
// con cada método (GET, POST, PUT, DELETE) y cada URL

// Importamos Express
const express = require("express");
// Creamos un router: un "mini servidor" solo para las rutas de categorías
const router = express.Router();
// Importamos el controlador
const categoryController = require("../controllers/categoryController");

// Todas estas rutas empiezan por /api/categories (se monta en index.js)
// :id es un hueco en la URL; su valor llega al controlador en req.params.id

// GET /api/categories → lista las categorías
router.get("/", categoryController.getAllCategories);
// GET /api/categories/:id → busca una categoría por su id
router.get("/:id", categoryController.getCategoryById);
// POST /api/categories → crea una categoría
router.post("/", categoryController.createCategory);
// PUT /api/categories/:id → modifica una categoría
router.put("/:id", categoryController.updateCategory);
// DELETE /api/categories/:id → borra una categoría
router.delete("/:id", categoryController.deleteCategory);

// Exportamos el router para montarlo en index.js
module.exports = router;
