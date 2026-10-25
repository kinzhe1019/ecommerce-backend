// El controlador se encarga de la parte HTTP: recibe la petición (req),
// llama al servicio y responde (res) con un código de estado y un JSON.
// Si hay un error, NO responde aquí: lo pasa con next(error) al errorHandler

// Importamos el servicio, que es el que trabaja con la base de datos
const productService = require("../services/productService");

// POST /api/products → crear un producto
const createProduct = async (req, res, next) => {
  try {
    // req.body son los datos en JSON que envía Postman
    const product = await productService.createProduct(req.body);
    // 201 = Created (creado). Devolvemos el producto, que ya tiene su _id
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// GET /api/products → listar todos los productos
const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    // 200 = OK. Devolvemos la lista de productos
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id → buscar un producto por su id
const getProductById = async (req, res, next) => {
  try {
    // req.params.id es el id que viene en la URL
    const product = await productService.getProductById(req.params.id);
    // Si no existe → creamos un error 404 y se lo pasamos al errorHandler
    // (el return hace que la función pare aquí)
    if (!product) {
      const error = new Error("Producte no trobat");
      error.status = 404;
      error.code = "NOT_FOUND";
      return next(error);
    }
    // Si existe → 200 con el producto
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id → modificar un producto
const updateProduct = async (req, res, next) => {
  try {
    // Le pasamos al servicio el id de la URL y los datos nuevos del body
    const product = await productService.updateProduct(req.params.id, req.body);
    if (!product) {
      const error = new Error("Producte no trobat");
      error.status = 404;
      error.code = "NOT_FOUND";
      return next(error);
    }
    // Si existe → 200 con el producto ya modificado
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id → borrar un producto
const deleteProduct = async (req, res, next) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    if (!product) {
      const error = new Error("Producte no trobat");
      error.status = 404;
      error.code = "NOT_FOUND";
      return next(error);
    }
    // 204 = No Content: se ha borrado y no devolvemos nada
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Exportamos las 5 funciones para usarlas en las rutas
module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
