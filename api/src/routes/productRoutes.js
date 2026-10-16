const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Todas estas rutas empiezan por /api/products (se monta en index.js)
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
