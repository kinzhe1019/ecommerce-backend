// El controlador se encarga de la parte HTTP: recibe la petición (req),
// llama al servicio y responde (res). Los errores van con next(error) al errorHandler.
// async/await: esperamos (await) a que el servicio termine con la base de datos.
// try/catch: si algo falla dentro del try, salta al catch

// Importamos el servicio de usuarios
const userService = require("../services/userService");

// POST /api/users → crear un usuario
const createUser = async (req, res, next) => {
  try {
    // El servicio comprueba la contraseña, hace el hash y no devuelve el hash
    const user = await userService.createUser(req.body);
    // 201 = Created
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    // Si algo falla (ej: email repetido), el error va al errorHandler
    next(error);
  }
};

// GET /api/users → listar (con filtros, ordenación y paginación)
const getAllUsers = async (req, res, next) => {
  try {
    // req.query = los parámetros de la URL (?active=true&page=2...)
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
    // null = no existe ese usuario → error 404
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
    // null = no existe ese usuario → error 404
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
    // null = no existe ese usuario → error 404
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

// POST /api/users/register → registrarse (crea el usuario y devuelve un token)
const register = async (req, res, next) => {
  try {
    const result = await userService.registerUser(req.body);
    // 201 = Created. En data van el usuario y el token
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// POST /api/users/login → iniciar sesión (devuelve un token)
const login = async (req, res, next) => {
  try {
    // Le pasamos al servicio el email y la contraseña que llegan en el body
    const result = await userService.loginUser(
      req.body.email,
      req.body.password,
    );
    // 200 = OK. En data van el usuario y el token
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// Exportamos las 7 funciones para usarlas en las rutas
module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deactivateUser,
  register,
  login,
};
