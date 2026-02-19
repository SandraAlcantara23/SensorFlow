// ============================================
// IMPORTACIONES
// ============================================

const express = require('express');      // Framework web para Node.js
const cors = require('cors');            // Middleware para permitir conexiones desde el frontend
const bodyParser = require('body-parser'); // Middleware para parsear JSON en las peticiones

const app = express();  // Creamos la aplicación Express
const PORT = process.env.PORT || 3001;

    // Puerto donde escuchará el servidor


// ============================================
// MIDDLEWARES (Configuración previa)
// ============================================

app.use(cors()); 
// Habilita CORS: permite que http://localhost:5173 (React)
// acceda a http://localhost:3001 (API)

app.use(bodyParser.json()); 
// Permite recibir datos en formato JSON en el cuerpo
// de las peticiones POST/PUT


// ============================================
// BASE DE DATOS SIMULADA (En memoria)
// ============================================
// En un proyecto real, aquí conectarías con MongoDB, MySQL, etc.

let sensores = [
  { id: 1, nombre: 'Sensor Sala', tipo: 'Temperatura', valor: 24 },
  { id: 2, nombre: 'Sensor Cocina', tipo: 'Humedad', valor: 60 },
  { id: 3, nombre: 'Sensor Jardín', tipo: 'Luz', valor: 85 }
];


// ============================================
// RUTAS DE LA API (Endpoints)
// ============================================


// GET /api/sensores - Obtener todos los sensores
app.get('/api/sensores', (req, res) => {
  // res.json() envía una respuesta en formato JSON
  res.json(sensores);
});


// POST /api/sensores - Crear un nuevo sensor
app.post('/api/sensores', (req, res) => {

  // req.body contiene los datos enviados desde el frontend
  const nuevoSensor = {
    id: Date.now(), // Generamos ID único con timestamp
    nombre: req.body.nombre,
    tipo: req.body.tipo,
    valor: Number(req.body.valor) // Aseguramos que sea número
  };

  sensores.push(nuevoSensor); // Agregamos al array "base de datos"

  // Respondemos con el sensor creado (status 201 = Created)
  res.status(201).json(nuevoSensor);
});


// DELETE /api/sensores/:id - Eliminar un sensor por ID
app.delete('/api/sensores/:id', (req, res) => {

  const id = parseInt(req.params.id); // Convertimos el parámetro URL a número

  // Filtramos el array para quitar el sensor con ese ID
  sensores = sensores.filter(sensor => sensor.id !== id);

  res.json({
    mensaje: 'Sensor eliminado correctamente',
    id: id
  });
});


// GET /api/sensores/tipo/:tipo - Filtrar por tipo (BONUS)
app.get('/api/sensores/tipo/:tipo', (req, res) => {

  const tipo = req.params.tipo;

  const filtrados = sensores.filter(s => s.tipo === tipo);

  res.json(filtrados);
});


// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log(`Servidor API corriendo en http://localhost:${PORT}`);
  console.log(`Endpoints disponibles:`);
  console.log(`GET    /api/sensores`);
  console.log(`POST   /api/sensores`);
  console.log(`DELETE /api/sensores/:id`);
});
