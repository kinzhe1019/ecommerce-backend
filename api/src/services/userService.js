// El servicio hace el trabajo con la base de datos usando el modelo.
// No sabe nada de HTTP: no usa req ni res

// bcrypt convierte la contraseña en un hash (un texto que no se puede "deshacer")
const bcrypt = require("bcrypt");
// Importamos el modelo User
const User = require("../models/User");

// Campos que se pueden modificar con PUT. Cualquier otro (role, passwordHash,
// active...) está prohibido
const allowedFields = ["name", "email", "password"];

// Comprueba la contraseña: tiene que ser texto de 12 caracteres como mínimo.
// Si no lo es, lanza un error 422
const checkPassword = (password) => {
  if (typeof password !== "string" || password.length < 12) {
    const error = new Error("Les dades no són vàlides");
    error.status = 422;
    error.code = "VALIDATION_ERROR";
    error.details = [
      {
        field: "password",
        message: "La contrasenya ha de tenir mínim 12 caràcters",
      },
    ];
    throw error;
  }
};

// Crear un usuario nuevo
const createUser = async (userData) => {
  // 1. Comprobamos la contraseña
  checkPassword(userData.password);
  // 2. La convertimos en hash (10 = "rondas": más alto = más seguro pero más lento)
  const passwordHash = await bcrypt.hash(userData.password, 10);
  // 3. Creamos el usuario cogiendo SOLO name y email del body.
  // El role lo pone el servidor: siempre "client"
  const newUser = new User({
    name: userData.name,
    email: userData.email,
    passwordHash: passwordHash,
    role: "client",
  });
  await newUser.save();
  // 4. Quitamos el hash antes de devolverlo, para que no salga en la respuesta
  newUser.passwordHash = undefined;
  return newUser;
};

// Listar usuarios con filtros, ordenación y paginación (igual que en categorías)
const getAllUsers = async (query) => {
  // 1. FILTROS
  const filter = {};
  if (query.active === "true") {
    filter.active = true;
  } else if (query.active === "false") {
    filter.active = false;
  }
  if (query.name) {
    filter.name = { $regex: query.name, $options: "i" };
  }

  // 2. ORDENACIÓN: solo por estos campos
  const allowedSorts = [
    "name",
    "-name",
    "email",
    "-email",
    "createdAt",
    "-createdAt",
  ];
  let sort = "name";
  if (query.sort) {
    if (!allowedSorts.includes(query.sort)) {
      const error = new Error(
        "Només es pot ordenar per: " + allowedSorts.join(", "),
      );
      error.status = 400;
      error.code = "INVALID_QUERY";
      throw error;
    }
    sort = query.sort;
  }

  // 3. PAGINACIÓN
  let page = 1;
  let limit = 10;
  if (query.page !== undefined) {
    page = Number(query.page);
  }
  if (query.limit !== undefined) {
    limit = Number(query.limit);
  }
  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1
  ) {
    const error = new Error("page i limit han de ser enters positius");
    error.status = 400;
    error.code = "INVALID_QUERY";
    throw error;
  }
  if (limit > 50) {
    limit = 50;
  }

  const total = await User.countDocuments(filter);
  // passwordHash no sale porque en el modelo tiene select: false
  const users = await User.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    data: users,
    pagination: {
      page: page,
      limit: limit,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Obtener un usuario por su _id (o null si no existe)
const getUserById = async (id) => {
  return await User.findById(id);
};

// Modificar un usuario
const updateUser = async (id, userData) => {
  // 1. Si envían un campo que no está en la lista → error 400
  for (const field in userData) {
    if (!allowedFields.includes(field)) {
      const error = new Error("No es pot modificar el camp " + field);
      error.status = 400;
      error.code = "FIELD_NOT_ALLOWED";
      throw error;
    }
  }
  // 2. Copiamos solo los campos permitidos que han llegado
  const changes = {};
  if (userData.name !== undefined) {
    changes.name = userData.name;
  }
  if (userData.email !== undefined) {
    changes.email = userData.email;
  }
  // Si cambian la contraseña, la comprobamos y guardamos el hash nuevo
  if (userData.password !== undefined) {
    checkPassword(userData.password);
    changes.passwordHash = await bcrypt.hash(userData.password, 10);
  }
  // 3. Guardamos los cambios (con validaciones) y devolvemos el usuario cambiado
  return await User.findByIdAndUpdate(id, changes, {
    returnDocument: "after",
    runValidators: true,
  });
};

// "Borrar" un usuario: baja lógica, solo ponemos active a false
// (el usuario sigue en la base de datos)
const deactivateUser = async (id) => {
  return await User.findByIdAndUpdate(
    id,
    { active: false },
    { returnDocument: "after" },
  );
};

// Exportamos las funciones para usarlas en el controlador
module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deactivateUser,
};
