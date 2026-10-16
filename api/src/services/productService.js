const Producte = require("../models/Producte");

// Crear un producto nuevo
const createProduct = async (productData) => {
  const newProduct = new Producte(productData);
  return await newProduct.save();
};

// Obtener todos los productos
const getAllProducts = async () => {
  return await Producte.find();
};

// Obtener un producto por su _id
const getProductById = async (id) => {
  return await Producte.findById(id);
};

// Modificar un producto. returnDocument: "after" devuelve el producto ya cambiado
// y runValidators: true hace que se apliquen las validaciones del modelo
const updateProduct = async (id, productData) => {
  return await Producte.findByIdAndUpdate(id, productData, {
    returnDocument: "after",
    runValidators: true,
  });
};

// Borrar un producto
const deleteProduct = async (id) => {
  return await Producte.findByIdAndDelete(id);
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
