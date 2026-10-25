// El controlador se encarga de la parte HTTP: recibe la petición (req),
// llama al servicio y responde (res). Los errores van con next(error) al errorHandler

// Importamos el servicio de usuarios
const userService = require("../services/userService");

// POST /api/users → crear un usuario
const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    // 201 = Created
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// GET /api/users → listar (con filtros, ordenación y paginación)
const getAllUsers = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers(req.query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/:id → buscar un usuario por su id
const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      const error = new Error("Usuari no trobat");
      error.status = 404;
      error.code = "NOT_FOUND";
      return next(error);
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id → modificar un usuario (solo name, email y password)
const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) {
      const error = new Error("Usuari no trobat");
      error.status = 404;
      error.code = "NOT_FOUND";
      return next(error);
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/:id → desactivar un usuario (active = false)
const deactivateUser = async (req, res, next) => {
  try {
    const user = await userService.deactivateUser(req.params.id);
    if (!user) {
      const error = new Error("Usuari no trobat");
      error.status = 404;
      error.code = "NOT_FOUND";
      return next(error);
    }
    // 200 con el usuario, para ver que ahora tiene active: false
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// Exportamos las 5 funciones para usarlas en las rutas
module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deactivateUser,
};
