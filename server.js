require('dotenv').config(); // 👈 1. Lee las variables del archivo .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares globales obligatorios
app.use(cors());
app.use(express.json());

// 1. CONEXIÓN A MONGOOSE (Base de datos en la nube: MongoDB Atlas)
// Usa la variable secreta de tu archivo .env, si no existe usa la local como respaldo
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/warastore";

mongoose.connect(MONGO_URI)
  .then(() => console.log("🚀 ¡Conexión exitosa a MongoDB Atlas (Nube)!"))
  .catch((err) => console.error("🔴 Error conectando a MongoDB Atlas:", err));

// 2. DEFINICIÓN DEL MODELO DE PRODUCTO
const productoSchema = new mongoose.Schema({
  nombre: String,
  categoria: String,
  precio_original: Number,
  precio_actual: Number,
  tallas: [String],
  imagenes: [String],
  etiquetas: [String]
});

// Evita re-declarar el modelo si ya existe en memoria durante recargas en caliente
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

// 4. RUTA DE ACTIVACIÓN: Poblar/Cargar el catálogo completo directo desde el navegador
app.get('/api/cargar-catalogo-wara', async (req, res) => {
  try {
    const productosNuevos = [
      {
        nombre: "Camisa polo para hombre spence",
        categoria: "CAMISAS Y POLERAS HOMBRE",
        precio_original: 299,
        precio_actual: 299,
        tallas: ["S", "M", "L", "XL"],
        imagenes: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600"],
        etiquetas: ["Nuevo"]
      },
      {
        nombre: "Ropa bebé de algodón orgánico",
        categoria: "BEBÉ",
        precio_original: 450,
        precio_actual: 389,
        tallas: ["8", "10", "12"],
        imagenes: ["/bebe.jpg"],
        etiquetas: ["Oferta", "Nuevo"]
      },
      {
        nombre: "Mochila Urbana Impermeable Pro",
        categoria: "MOCHILAS",
        precio_original: 340,
        precio_actual: 340,
        tallas: ["Estándar"],
        imagenes: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600"],
        etiquetas: ["Nuevo"]
      },
      {
        nombre: "Ropa Interior de Algodón",
        categoria: "MUJER",
        precio_original: 180,
        precio_actual: 149,
        tallas: ["S", "M", "L"],
        imagenes: ["/mujer.jpg"],
        etiquetas: ["Tendencia"]
      },
      {
        nombre: "Cuarta Algodón Brasier",
        categoria: "MUJER",
        precio_original: 320,
        precio_actual: 299,
        tallas: ["XS", "S", "M"],
        imagenes: ["/Brasier.jpg"],
        etiquetas: ["Nuevo"]
      },
      {
        nombre: "Gorra Trucker Black Cat",
        categoria: "ACCESORIOS",
        precio_original: 120,
        precio_actual: 99,
        tallas: ["Ajustable"],
        imagenes: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600"],
        etiquetas: ["Oferta"]
      }
    ];

    // Limpia registros viejos en Atlas e inserta las prendas de golpe
    await Producto.deleteMany({});
    await Producto.insertMany(productosNuevos);

    res.send(`
      <div style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h1 style="color: #10b981;">⚡ ¡Éxito Total en la Nube! ⚡</h1>
        <p style="font-size: 18px; color: #4b5563;">La base de datos de MongoDB Atlas ha sido poblada con tus productos.</p>
        <p style="font-weight: bold; color: #111827;">Ya puedes cerrar esta pestaña y verificar tu tienda.</p>
      </div>
    `);
  } catch (error) {
    res.status(500).send("Error interno cargando catálogo en la nube: " + error.message);
  }
});

// 5. PUERTO DE ESCUCHA DINÁMICO
// Toma el puerto que te asigne el servidor en internet, o el 5000 por defecto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo exitosamente en el puerto ${PORT}`);
});