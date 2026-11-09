// El servicio hace el trabajo con la base de datos usando el modelo.
// No sabe nada de HTTP: no usa req ni res

// Importamos el modelo Category
const Category = require("../models/Category");

// Crear una categoría nueva
const createCategory = async (categoryData) => {
  // Creamos la categoría con el "molde" del modelo
  const newCategory = new Category(categoryData);
  // La guardamos. Antes de guardar, Mongoose comprueba las validaciones
  return await newCategory.save();
};

// Listar categorías con filtros, ordenación y paginación.
// query son los parámetros de la URL (lo que va después del ?)
const getAllCategories = async (query) => {
  // 1. FILTROS: un objeto con las condiciones de búsqueda
  const filter = {};
  // ?active=true o ?active=false (en la URL todo llega como texto)
  if (query.active === "true") {
    filter.active = true;
  } else if (query.active === "false") {
    filter.active = false;
  }
  // ?name=rob → las que tienen "rob" en el nombre
  // ($regex = "contiene", $options "i" = da igual mayúsculas o minúsculas)
  if (query.name) {
    filter.name = { $regex: query.name, $options: "i" };
  }

  // 2. ORDENACIÓN: solo dejamos ordenar por estos campos
  // (con "-" delante = de mayor a menor)
  const allowedSorts = ["name", "-name", "createdAt", "-createdAt"];
  // Si no se envía sort, ordenamos por nombre (A-Z)
  let sort = "name";
  if (query.sort) {
    // Si piden ordenar por otro campo → error 400
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

  // 3. PAGINACIÓN: si no se envía nada, página 1 y 10 resultados
  let page = 1;
  let limit = 10;
  // Number() convierte el texto de la URL en número ("2" → 2)
  if (query.page !== undefined) {
    page = Number(query.page);
  }
  if (query.limit !== undefined) {
    limit = Number(query.limit);
  }
  // Tienen que ser números enteros positivos (1, 2, 3...)
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
  // Límite máximo: como mucho 50 resultados por página
  if (limit > 50) {
    limit = 50;
  }

  // Contamos cuántas hay en total (con los filtros) para saber las páginas
  const total = await Category.countDocuments(filter);
  // skip = cuántas nos saltamos (las de las páginas anteriores)
  const categories = await Category.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  // Devolvemos las categorías y los datos de la paginación
  return {
    data: categories,
    pagination: {
      page: page,
      limit: limit,
      total: total,
      // Math.ceil redondea hacia arriba (ej: 11 categorías / 10 = 1,1 → 2 páginas)
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Obtener una categoría por su _id (o null si no existe)
const getCategoryById = async (id) => {
  return await Category.findById(id);
};

// Modificar una categoría. returnDocument: "after" devuelve la categoría ya cambiada
// y runValidators: true hace que se apliquen las validaciones del modelo
const updateCategory = async (id, categoryData) => {
  return await Category.findByIdAndUpdate(id, categoryData, {
    returnDocument: "after",
    runValidators: true,
  });
};

// Borrar una categoría. Devuelve la categoría borrada, o null si no existía
const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};

// Exportamos las funciones para usarlas en el controlador
module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
