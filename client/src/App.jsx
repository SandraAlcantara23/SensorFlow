// client/src/App.jsx
// ============================================
// FRONTEND: Dashboard Reactivo con React
// ============================================

// 🔹 IMPORTS: Hooks de React para manejar estado y efectos
import { useState, useEffect } from 'react';
import './App.css';

function App() {

  // ============================================
  // 1️⃣ ESTADO REACTIVO (Tema 1.1 - Definición)
  // ============================================

  // Estado principal: lista de sensores
  const [sensores, setSensores] = useState([]);

  // Estado para el formulario de nuevo sensor
  const [formulario, setFormulario] = useState({
    nombre: '',
    tipo: '',
    valor: ''
  });

  // Estado para mensajes de carga/error
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Filtro por tipo
  const [filtroTipo, setFiltroTipo] = useState('todos');


  // ============================================
  // 2️⃣ EFECTOS SECUNDARIOS (Ciclo de vida)
  // ============================================

  useEffect(() => {
    cargarSensores();
  }, []); // Solo al montar el componente


  // Función para obtener datos del backend
  const cargarSensores = async () => {
    setCargando(true);
    setError(null);

    try {
      const respuesta = await fetch('https://sensorflow-backend.onrender.com/api/sensores');

      if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
      }

      const datos = await respuesta.json();

      // Reactividad: al cambiar el estado, la UI se actualiza sola
      setSensores(datos);

    } catch (err) {
      console.error("❌ Error al cargar sensores:", err);
      setError("No se pudo conectar con el servidor. ¿Está corriendo el backend?");
    } finally {
      setCargando(false);
    }
  };


  // 🔹 Manejar cambios en los inputs del formulario
  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };


  // 🔹 Agregar nuevo sensor (POST)
  const agregarSensor = async (e) => {
    e.preventDefault();

    if (!formulario.nombre || !formulario.tipo || !formulario.valor) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3001/api/sensores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formulario)
      });

      if (!respuesta.ok) {
        throw new Error("Error al crear sensor");
      }

      // Limpiar formulario
      setFormulario({ nombre: '', tipo: '', valor: '' });

      // Recargar lista
      cargarSensores();

    } catch (err) {
      console.error("❌ Error:", err);
      alert("Error al agregar el sensor");
    }
  };


  // 🔹 Eliminar sensor (DELETE)
  const eliminarSensor = async (id) => {

    const sensor = sensores.find(s => s.id === id);

    if (!window.confirm(`¿Eliminar ${sensor?.nombre}?`)) {
      return;
    }

    try {
      await fetch(`http://localhost:3001/api/sensores/${id}`, {
        method: 'DELETE'
      });

      cargarSensores();

    } catch (err) {
      console.error("❌ Error al eliminar:", err);
      alert("Error al eliminar el sensor");
    }
  };


  // Sensores filtrados (reactividad)
  const sensoresFiltrados =
    filtroTipo === 'todos'
      ? sensores
      : sensores.filter(s => s.tipo === filtroTipo);


  // ============================================
  // 3️⃣ VISTA DECLARATIVA
  // ============================================

  return (
    <div className="contenedor">

      <header>
        <h1>📡 SensorFlow Dashboard</h1>
        <p className="subtitulo">
          Programación Reactiva con React + Node.js
        </p>
      </header>

      {/* --- FORMULARIO --- */}
      <form onSubmit={agregarSensor} className="formulario">

        <input
          name="nombre"
          placeholder="Nombre (ej. Sala)"
          value={formulario.nombre}
          onChange={manejarCambio}
          required
          aria-label="Nombre del sensor"
        />

        <select
          name="tipo"
          value={formulario.tipo}
          onChange={manejarCambio}
          required
          aria-label="Tipo de sensor"
        >
          <option value="">Tipo...</option>
          <option value="Temperatura">🌡️ Temperatura</option>
          <option value="Humedad">💧 Humedad</option>
          <option value="Luz">☀️ Luz</option>
        </select>

        <input
          name="valor"
          type="number"
          placeholder="Valor"
          value={formulario.valor}
          onChange={manejarCambio}
          required
          aria-label="Valor medido"
        />

        <button type="submit" disabled={cargando}>
          {cargando ? 'Cargando...' : '➕ Agregar'}
        </button>

      </form>


      {/* --- FILTROS --- */}
      <div className="filtros">
        <label>Filtrar por tipo: </label>

        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="Temperatura">Temperatura</option>
          <option value="Humedad">Humedad</option>
          <option value="Luz">Luz</option>
        </select>
      </div>


      {/* --- MENSAJES --- */}
      {error && <div className="error">⚠️ {error}</div>}

      {cargando && !sensores.length && (
        <div className="cargando">
          ⏳ Cargando sensores...
        </div>
      )}


      {/* --- LISTA DE SENSORES --- */}
      <div className="grid-sensores">

        {sensoresFiltrados.map((sensor) => (

          <article key={sensor.id} className="tarjeta-sensor">

            <h3>{sensor.nombre}</h3>

            <p className="tipo">
              🏷️ {sensor.tipo}
            </p>

            <p className="valor">
              📊 {sensor.valor}{' '}
              {sensor.tipo === 'Temperatura'
                ? '°C'
                : sensor.tipo === 'Humedad'
                  ? '%'
                  : 'lux'}
            </p>

            <button
              onClick={() => eliminarSensor(sensor.id)}
              className="btn-eliminar"
              aria-label={`Eliminar ${sensor.nombre}`}
            >
              🗑️ Eliminar
            </button>

          </article>

        ))}

      </div>


      {/* --- MENSAJE VACÍO --- */}
      {sensoresFiltrados.length === 0 && !cargando && (
        <p className="vacio">
          {filtroTipo === 'todos'
            ? 'No hay sensores registrados. ¡Agrega uno!'
            : `No hay sensores de tipo "${filtroTipo}"`}
        </p>
      )}

    </div>
  );
}

export default App;