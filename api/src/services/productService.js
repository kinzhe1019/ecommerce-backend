// El servicio hace el trabajo con la base de datos usando el modelo.
// No sabe nada de HTTP: no usa req ni res

// Importamos el modelo Product
const Product = require("../models/Product");

// Crear un producto nuevo
const createProduct = async (productData) => {
  // Creamos el producto con el "molde" del modelo
  const newProduct = new Product(productData);
  // Lo guardamos en MongoDB. Antes de guardar, Mongoose comprueba las validaciones
  return await newProduct.save();
};

// Obtener todos los productos
const getAllProducts = async () => {
  // populate("category", "name slug") cambia el _id de la categoría
  // por la categoría de verdad (solo con su name y su slug)
  return await Product.find().populate("category", "name slug");
};

// Obtener un producto por su _id (también con su categoría)
const getProductById = async (id) => {
  // Devuelve el producto, o null si no existe
  return await Product.findById(id).populate("category", "name slug");
};

// Modificar un producto. returnDocument: "after" devuelve el producto ya cambiado
// y runValidators: true hace que se apliquen las validaciones del modelo
// (sin esto, al modificar no se validaría nada)
const updateProduct = async (id, productData) => {
  return await Product.findByIdAndUpdate(id, productData, {
    returnDocument: "after",
    runValidators: true,
  });
};

// Borrar un producto. Devuelve el producto borrado, o null si no existía
const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

// Exportamos las funciones para usarlas en el controlador
module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
