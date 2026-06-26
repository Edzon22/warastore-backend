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
app.get('/api/cargar-catalogo-wara', async (req, res) => {
  try {
    const productosNuevos = [
      {
        nombre: "Camisa polo para hombre spence",
        categoria: "CAMISAS Y POLERAS HOMBRE",
        precio_original: 120,
        precio_actual: 99,    // 🎯 Tu precio: 99 Unidad
        precio_cuarta: 270,   // 🎯 Tu precio: 270 Cuarta
        precio_docena: 1040,  // 🎯 Tu precio: 1040 Docena
        tallas: ["S", "M", "L", "XL"],
        imagenes: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600"],
        etiquetas: ["Nuevo"]
      },
      {
        nombre: "Cuarta Algodón Brasier",
        categoria: "MUJER",
        precio_original: 80,
        precio_actual: 60,    // 🎯 Tu precio: 60 Unidad
        precio_cuarta: 165,   // 🎯 Tu precio: 165 Cuarta
        precio_docena: 600,   // 🎯 Tu precio: 600 Docena
        tallas: ["XS", "S", "M"],
        imagenes: ["/Brasier.jpg"],
        etiquetas: ["Nuevo"]
      },
      {
        nombre: "Ropa bebé de algodón orgánico",
        categoria: "BEBÉ",
        precio_original: 90,
        precio_actual: 70,
        precio_cuarta: 170,
        precio_docena: 650,
        tallas: ["8", "10", "12"],
        imagenes: ["/bebe.jpg"],
        etiquetas: ["Oferta", "Nuevo"]
      },
      {
        nombre: "Mochila Urbana Impermeable Pro",
        categoria: "MOCHILAS",
        precio_original: 180,
        precio_actual: 150,
        precio_cuarta: 420,
        precio_docena: 1665,
        tallas: ["Estándar"],
        imagenes: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600"],
        etiquetas: ["Nuevo"]
      },
      {
        nombre: "Ropa Interior de Algodón",
        categoria: "MUJER",
        precio_original: 45,
        precio_actual: 35,
        precio_cuarta: 95,
        precio_docena: 340,
        tallas: ["S", "M", "L"],
        imagenes: ["/mujer.jpg"],
        etiquetas: ["Tendencia"]
      },
      {
        nombre: "Gorra Trucker Black Cat",
        categoria: "ACCESORIOS",
        precio_original: 50,
        precio_actual: 40,
        precio_cuarta: 110,
        precio_docena: 440,
        tallas: ["Ajustable"],
        imagenes: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600"],
        etiquetas: ["Oferta"]
      }
    ];

    await Producto.deleteMany({});
    await Producto.insertMany(productosNuevos);

    res.send(`
      <div style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h1 style="color: #10b981;">⚡ ¡Precios Oficiales Cargados! ⚡</h1>
        <p style="font-size: 18px; color: #4b5563;">La base de datos se actualizó con los precios que me indicaste para Poleras y Brasieres.</p>
        <p style="font-weight: bold; color: #111827;">Ya puedes cerrar esta pestaña.</p>
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