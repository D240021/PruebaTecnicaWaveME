// ========================================
// IMPORTACIONES
// ========================================
import { crearPelicula } from '/servicios/api.js';
import { subirImagenCloudinary } from '../servicios/cloudinary.js';
import { validarImagen } from '../utils/funciones.js';

// ========================================
// ELEMENTOS DEL DOM
// ========================================
const form = document.getElementById('crearPeliculaForm');
const mensaje = document.getElementById('mensaje');
const botonCrearPelicula = document.getElementById("btnCrearPelicula");
const inputImagen = document.getElementById("imagen");
const inputs = form.querySelectorAll('input, textarea');

// ========================================
// FUNCIONES AUXILIARES
// ========================================

/**
 * Limpia el mensaje de feedback después de 1.5 segundos
 */
const limpiarMensaje = () => {
  setTimeout(() => mensaje.innerHTML = '', 1500);
};

/**
 * Valida que todos los campos del formulario estén completos
 * @returns {boolean} true si todos los campos tienen valor
 */
const validarCampos = () => 
  Array.from(inputs).every(input => input.value.trim() !== '');

/**
 * Muestra un mensaje de error en el DOM
 * @param {string} texto - Mensaje de error a mostrar
 */
const mostrarError = (texto) => {
  mensaje.innerHTML = `<p style='color:red'>${texto}</p>`;
  limpiarMensaje();
};

/**
 * Muestra un mensaje de éxito en el DOM
 * @param {string} texto - Mensaje de éxito a mostrar
 */
const mostrarExito = (texto) => {
  mensaje.innerHTML = `<p style='color:green'>${texto}</p>`;
  limpiarMensaje();
};

/**
 * Resetea el formulario a su estado inicial
 */
const resetearFormulario = () => {
  form.reset();
  botonCrearPelicula.disabled = true;
};

// ========================================
// VALIDACIÓN EN TIEMPO REAL
// ========================================

/**
 * Habilita/deshabilita el botón según el estado de los campos
 */
const actualizarEstadoBoton = () => {
  botonCrearPelicula.disabled = !validarCampos();
};

// Escuchar cambios en todos los inputs para validar en tiempo real
inputs.forEach(input => {
  input.addEventListener('input', actualizarEstadoBoton);
});

// Estado inicial del botón
actualizarEstadoBoton();

// ========================================
// MANEJO DEL SUBMIT
// ========================================

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    // 1. Validar que se haya seleccionado una imagen
    const imagenFile = inputImagen.files[0];
    if (!imagenFile) {
      mostrarError("Debe subir una imagen.");
      return;
    }

    // 2. Validar formato de imagen
    if (!validarImagen(imagenFile)) {
      mostrarError("El archivo debe ser una imagen válida.");
      inputImagen.value = "";
      return;
    }

    // 3. Subir imagen a Cloudinary
    const urlImagen = await subirImagenCloudinary(imagenFile);

    // 4. Preparar payload para la API
    const payload = {
      nombre: document.getElementById('nombre').value,
      descripcion: document.getElementById('descripcion').value,
      fechaSalida: document.getElementById('fechaSalida').value,
      urlImagen
    };

    // 5. Enviar petición a la API
    const response = await crearPelicula(payload);

    // 6. Manejar respuesta
    if (response.ok) {
      mostrarExito("Película creada correctamente.");
      resetearFormulario();
    } else {
      mostrarError("Error al crear la película.");
    }

  } catch (error) {
    console.error("Error en el proceso de creación:", error);
    mostrarError("Error de conexión o al subir la imagen.");
  }
});