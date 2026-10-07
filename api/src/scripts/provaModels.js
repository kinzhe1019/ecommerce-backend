// Script per provar els models. S'executa des de la carpeta api amb:
// node src/scripts/provaModels.js
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Categoria = require("../models/Categoria");
const Producte = require("../models/Producte");
const Usuari = require("../models/Usuari");
const Carret = require("../models/Carret");
const Comanda = require("../models/Comanda");

async function provar() {
  await connectDB();

  // Borramos los datos de la prueba anterior
  await Categoria.deleteMany({});
  await Producte.deleteMany({});
  await Usuari.deleteMany({});
  await Carret.deleteMany({});
  await Comanda.deleteMany({});

  // Esperamos a que MongoDB cree los índices
  await Usuari.init();
  await Producte.init();

  // 1. Datos correctos: se tienen que guardar
  const roba = await Categoria.create({ nom: "Roba" });
  const samarreta = await Producte.create({
    nom: "Samarreta",
    preu: 19.99,
    stock: 10,
    categoria: roba._id,
  });
  const anna = await Usuari.create({
    nom: "Anna",
    email: "anna@prova.com",
    password: "12345678",
  });
  const carret = await Carret.create({
    usuari: anna._id,
    productes: [{ producte: samarreta._id, quantitat: 2 }],
  });
  await Comanda.create({
    carret: carret._id,
    productes: [{ producte: samarreta._id, quantitat: 2, preu: 19.99 }],
    total: 39.98,
    adrecaEnviament: "C/ Major 1",
  });
  console.log(
    "OK: s'han guardat la categoria, el producte, l'usuari, el carret i la comanda",
  );

  // 2. Producto con datos incorrectos: tiene que dar error
  try {
    await Producte.create({ nom: "Gorra", preu: -5, stock: 2.5 });
  } catch (error) {
    console.log("ERROR esperat (producte):", error.message);
  }

  // 3. Usuario con datos incorrectos: tiene que dar error
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
  try {
    await Usuari.create({
      nom: "Anna 2",
      email: "anna@prova.com",
      password: "12345678",
    });
  } catch (error) {
    console.log("ERROR esperat (email repetit):", error.message);
  }

  // 5. Carrito con 150 unidades (el máximo es 99): tiene que dar error
  try {
    await Carret.create({
      usuari: anna._id,
      productes: [{ producte: samarreta._id, quantitat: 150 }],
    });
  } catch (error) {
    console.log("ERROR esperat (carret):", error.message);
  }

  // 6. Miramos los índices de Producte
  const indexs = await Producte.listIndexes();
  for (const index of indexs) {
    console.log("Índex de Producte:", index.name);
  }

  // 7. Comprobamos que buscar por categoría usa el índice (IXSCAN)
  const pla = await Producte.find({ categoria: roba._id }).explain();
  if (JSON.stringify(pla).includes("IXSCAN")) {
    console.log("La cerca per categoria fa servir l'índex (IXSCAN)");
  } else {
    console.log("La cerca per categoria NO fa servir l'índex");
  }

  await mongoose.disconnect();
}

provar();
