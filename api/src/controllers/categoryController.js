// El controlador se encarga de la parte HTTP: recibe la petición (req),
// llama al servicio y responde (res) con un código de estado y un JSON.
// Si hay un error, NO responde aquí: lo pasa con next(error) al errorHandler

// Importamos el servicio, que es el que trabaja con la base de datos
const categoryService = require("../services/categoryService");

// POST /api/categories → crear una categoría
const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    // 201 = Created
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// GET /api/categories → listar (con filtros, ordenación y paginación)
const getAllCategories = async (req, res, next) => {
  try {
    // req.query = los parámetros de la URL (?active=true&page=2...)
    const result = await categoryService.getAllCategories(req.query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/categories/:id → buscar una categoría por su id
const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    // Si no existe → creamos un error 404 y se lo pasamos al errorHandler
    if (!category) {
      const error = new Error("Categoria no trobada");
      error.status = 404;
      error.code = "NOT_FOUND";
      return next(error);
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// PUT /api/categories/:id → modificar una categoría
const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body,
    );
    if (!category) {
      const error = new Error("Categoria no trobada");
      error.status = 404;
      error.code = "NOT_FOUND";
      return next(error);
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/categories/:id → borrar una categoría
const deleteCategory = async (req, res, next) => {
  try {
    const category = await categoryService.deleteCategory(req.params.id);
    if (!category) {
      const error = new Error("Categoria no trobada");
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
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
