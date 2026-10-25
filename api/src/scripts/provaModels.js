// Script per provar els models. S'executa des de la carpeta api amb:
// node src/scripts/provaModels.js
// (No forma parte de la API: solo sirve para comprobar que los modelos validan bien)

// Cargamos el .env, Mongoose, la función de conexión y los 5 modelos
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Categoria = require("../models/Categoria");
const Producte = require("../models/Producte");
const Usuari = require("../models/Usuari");
const Carret = require("../models/Carret");
const Comanda = require("../models/Comanda");

// Función con todas las pruebas, en orden
async function provar() {
  // Nos conectamos a MongoDB
  await connectDB();

  // Borramos los datos de la prueba anterior
  await Categoria.deleteMany({});
  await Producte.deleteMany({});
  await Usuari.deleteMany({});
  await Carret.deleteMany({});
  await Comanda.deleteMany({});

  // Esperamos a que MongoDB cree los índices
  // (si no, el unique del email todavía podría no funcionar)
  await Usuari.init();
  await Producte.init();

  // 1. Datos correctos: se tienen que guardar
  // Creamos una categoría
  const roba = await Categoria.create({ nom: "Roba" });
  // Creamos un producto de esa categoría (usamos el _id de la categoría)
  const samarreta = await Producte.create({
    nom: "Samarreta",
    preu: 19.99,
    stock: 10,
    categoria: roba._id,
  });
  // Creamos un usuario
  const anna = await Usuari.create({
    nom: "Anna",
    email: "anna@prova.com",
    password: "12345678",
  });
  // Creamos el carrito de ese usuario con 2 camisetas
  const carret = await Carret.create({
    usuari: anna._id,
    productes: [{ producte: samarreta._id, quantitat: 2 }],
  });
  // Creamos un pedido que sale de ese carrito
  await Comanda.create({
    carret: carret._id,
    productes: [{ producte: samarreta._id, quantitat: 2, preu: 19.99 }],
    total: 39.98,
    adrecaEnviament: "C/ Major 1",
  });
  // Si llegamos aquí, todo se ha guardado bien
  console.log(
    "OK: s'han guardat la categoria, el producte, l'usuari, el carret i la comanda",
  );

  // 2. Producto con datos incorrectos: tiene que dar error
  // Falla por: falta la categoría (required), precio negativo (min)
  // y stock con decimales (validación custom)
  // try: intentamos guardarlo / catch: si da error, lo escribimos y seguimos
  try {
    await Producte.create({ nom: "Gorra", preu: -5, stock: 2.5 });
  } catch (error) {
    console.log("ERROR esperat (producte):", error.message);
  }

  // 3. Usuario con datos incorrectos: tiene que dar error
  // Falla por: email sin @ (match), contraseña corta (minlength)
  // y un rol que no existe (enum)
  try {
    await Usuari.create({
      nom: "Pep",
      email: "aixo-no-es-un-email",
      password: "123",
      rol: "jefe",
    });
  } catch (error) {
    console.log("ERROR esperat (usuari):", error.message);
  }

  // 4. Email repetido: tiene que dar error por el unique
  // (este error, E11000, lo da MongoDB y no Mongoose)
  try {
    await Usuari.create({
      nom: "Anna 2",
      email: "anna@prova.com",
      password: "12345678",
    });
  } catch (error) {
    console.log("ERROR esperat (email repetit):", error.message);
  }

  // 5. Carrito con 150 unidades (el máximo es 99): tiene que dar error (max)
  try {
    await Carret.create({
      usuari: anna._id,
      productes: [{ producte: samarreta._id, quantitat: 150 }],
    });
  } catch (error) {
    console.log("ERROR esperat (carret):", error.message);
  }

  // 6. Miramos los índices de Producte (tienen que salir _id_ y categoria_1)
  // listIndexes() pide la lista a MongoDB y el for los escribe uno a uno
  const indexs = await Producte.listIndexes();
  for (const index of indexs) {
    console.log("Índex de Producte:", index.name);
  }

  // 7. Comprobamos que buscar por categoría usa el índice (IXSCAN)
  // explain() no devuelve los productos, sino CÓMO ha hecho MongoDB la búsqueda.
  // Si en esa explicación aparece "IXSCAN", es que ha usado el índice
  const pla = await Producte.find({ categoria: roba._id }).explain();
  if (JSON.stringify(pla).includes("IXSCAN")) {
    console.log("La cerca per categoria fa servir l'índex (IXSCAN)");
  } else {
    console.log("La cerca per categoria NO fa servir l'índex");
  }

  // Nos desconectamos de MongoDB para que el script termine
  await mongoose.disconnect();
}

// Ejecutamos las pruebas
provar();
