const mongoose = require('mongoose');

// Conexión exacta a tu base de datos local
const MONGO_URI = "mongodb://localhost:27017/warastore"; 

mongoose.connect(MONGO_URI)
  .then(() => console.log("¡Conectado a MongoDB para poblar catálogo!"))
  .catch(err => console.error("Error de conexión:", err));

// Definición del esquema idéntico al tuyo
const productoSchema = new mongoose.Schema({
  nombre: String,
  categoria: String,
  precio_original: Number,
  precio_actual: Number,
  tallas: [String],
  imagenes: [String],
  etiquetas: [String]
});

const Producto = mongoose.model('Producto', productoSchema);

const productosNuevos = [
  {
    nombre: "Camisa polo para hombre spence",
    categoria: "CAMISAS Y POLERAS",
    precio_original: 299,
    precio_actual: 299,
    tallas: ["S", "M", "L", "XL"],
    imagenes: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600"],
    etiquetas: ["Nuevo"]
  },
  {
    nombre: "Chamarra Bomber Minimalist Negra",
    categoria: "ROPA",
    precio_original: 450,
    precio_actual: 389,
    tallas: ["M", "L", "XL"],
    imagenes: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600"],
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
    nombre: "Polera Oversize Algodón Premium Blanca",
    categoria: "HOMBRE",
    precio_original: 180,
    precio_actual: 149,
    tallas: ["S", "M", "L"],
    imagenes: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600"],
    etiquetas: ["Tendencia"]
  },
  {
    nombre: "Vestido Casual Knit Wara Edition",
    categoria: "MUJER",
    precio_original: 320,
    precio_actual: 299,
    tallas: ["XS", "S", "M"],
    imagenes: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600"],
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

const seedDB = async () => {
  try {
    await Producto.deleteMany({}); // Borra registros viejos para evitar duplicados
    await Producto.insertMany(productosNuevos);
    console.log("¡Catálogo de WARA'STORE poblado con éxito con 6 productos premium!");
  } catch (error) {
    console.error("Error al poblar la base de datos:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();