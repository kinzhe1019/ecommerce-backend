// RUTAS DE USUARIOS: dicen qué función del controlador se ejecuta
// con cada método (GET, POST, PUT, DELETE) y cada URL

// Importamos Express
const express = require("express");
// Creamos un router solo para las rutas de usuarios
const router = express.Router();
// Importamos el controlador
const userController = require("../controllers/userController");

// Todas estas rutas empiezan por /api/users (se monta en index.js)
// ATENCIÓN: register y login ya funcionan con JWT, pero el CRUD todavía no
// está protegido con el token (eso vendrá más adelante): solo en local

// POST /api/users/register → registro (cualquiera puede registrarse)
router.post("/register", userController.register);
// POST /api/users/login → login (devuelve el token JWT)
router.post("/login", userController.login);

// GET /api/users → lista los usuarios
router.get("/", userController.getAllUsers);
// GET /api/users/:id → busca un usuario por su id
router.get("/:id", userController.getUserById);
// POST /api/users → crea un usuario
router.post("/", userController.createUser);
// PUT /api/users/:id → modifica un usuario
router.put("/:id", userController.updateUser);
// DELETE /api/users/:id → desactiva un usuario (baja lógica)
router.delete("/:id", userController.deactivateUser);

// Exportamos el router para montarlo en index.js
module.exports = router;
