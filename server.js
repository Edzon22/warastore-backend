require('dotenv').config(); // 👈 1. Lee las variables del archivo .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares globales obligatorios
app.use(cors());
app.use(express.json());

// 1. CONEXIÓN A MONGOOSE (Base de datos en la nube: MongoDB Atlas)
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/warastore";

mongoose.connect(MONGO_URI)
  .then(() => console.log("🚀 ¡Conexión exitosa a MongoDB Atlas (Nube)!"))
  .catch((err) => console.error("🔴 Error conectando a MongoDB Atlas:", err));

// 2. DEFINICIÓN DEL MODELO DE PRODUCTO
const productoSchema = new mongoose.Schema({
  nombre: String,
  categoria: String,
  precio_original: Number,
  precio_actual: Number, // Precio por Unidad
  precio_cuarta: Number, 
  precio_docena: Number, 
  tallas: [String],
  imagenes: [String],
  etiquetas: [String]
});

const Producto = mongoose.models.Producto || mongoose.model('Producto', productoSchema);

// 3. RUTA DEL API: Obtener todos los productos para el frontend
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al traer los productos", error: error.message });
  }
});

// 4. RUTA DE ACTIVACIÓN: Poblar con TUS PRECIOS REALES EXACTOS 🎯
// 4. RUTA DE ACTIVACIÓN: Poblar con TUS PRECIOS Y DATOS REALES EXACTOS 🎯
app.get('/api/cargar-catalogo-wara', async (req, res) => {
  try {
    const productosNuevos = [
      {
        nombre: "Ropa Interior modelo Encaje Arriba",
        categoria: "MUJER",
        precio_original: 40,
        precio_actual: 25,
        precio_cuarta: 60,
        precio_docena: 190,
        tallas: ["G"],
        colores: ["Blanco", "Negro", "Rojo", "Azul", "Amarillo"],
        imagenes: ["/1.jpeg"],
        etiquetas: ["Nuevo"]
      },
      {
        nombre: "Ropa Interior Encaje sin Liga arriba",
        categoria: "MUJER",
        precio_original: 30,
        precio_actual: 25,
        precio_cuarta: 60,
        precio_docena: 180,
        tallas: ["XL"],
        colores: ["Blanco", "Negro", "Rojo", "Azul", "Amarillo"],
        imagenes: ["/3.jpeg"],
        etiquetas: ["Nuevo"]
      },
      {
        nombre: "Ropa Interior Material Licra Brasilero",
        categoria: "MUJER",
        precio_original: 40,
        precio_actual: 30,
        precio_cuarta: 80,
        precio_docena: 230,
        tallas: ["G=L", "GG=XL", "TALLA PANTALÓN 36 Y 38 A 40"],
        colores: ["Blanco", "Negro", "Rojo", "Azul", "Amarillo"],
        imagenes: ["/5.jpeg"],
        etiquetas: ["Oferta", "Nuevo"]
      },
      {
        nombre: "Ropa Interior Mujer",
        categoria: "MUJER",
        precio_original: 30,
        precio_actual: 20,
        precio_cuarta: 50,
        precio_docena: 180,
        tallas: ["G", "GG"],
        colores: ["Blanco", "Negro", "Rojo", "Azul", "Amarillo"],
        imagenes: ["/7.jpeg"],
        etiquetas: ["Nuevo"]
      },
      {
        nombre: "Ropa Interior Algodón",
        categoria: "MUJER",
        precio_original: 30,
        precio_actual: 20,
        precio_cuarta: 50,
        precio_docena: 140,
        tallas: ["M","L","XL"],
        colores: ["Blanco", "Negro", "Rojo", "Azul", "Amarillo"],
        imagenes: ["/8.jpeg"],
        etiquetas: ["Tendencia"]
      }
    ];

    await Producto.deleteMany({});
    await Producto.insertMany(productosNuevos);

    res.send(`
      <div style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h1 style="color: #10b981;">⚡ ¡Catálogo Oficial Actualizado Exitosamente! ⚡</h1>
        <p style="font-size: 18px; color: #4b5563;">La base de datos se restableció con tus productos, tallas exactas e imágenes locales.</p>
        <p style="font-weight: bold; color: #111827;">Ya puedes cerrar esta pestaña y actualizar el frontend.</p>
      </div>
    `);
  } catch (error) {
    res.status(500).send("Error interno cargando catálogo: " + error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo exitosamente en el puerto ${PORT}`);
});