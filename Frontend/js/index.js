// ========================================
// IMPORTACIONES
// ========================================
import { 
  obtenerPeliculas, 
  eliminarPeliculaFisica, 
  eliminarPeliculaLogica,
  actualizarPelicula 
} from '../servicios/api.js';
import { formatearFecha, validarImagen } from '../utils/funciones.js';
import { subirImagenCloudinary } from '../servicios/cloudinary.js';

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const campoInfo = document.querySelector(".movieList");
  const filtroInput = document.getElementById("filtroTitulo");
  const btnBuscarFiltro = document.getElementById("btnBuscarFiltro");
  const selectOcultos = document.getElementById("campoOcultos");

  if (!campoInfo) return;

  // ========================================
  // FUNCIONES DE MODAL
  // ========================================

  /**
   * Crea y estiliza el overlay del modal
   * @returns {HTMLElement} Elemento overlay
   */
  const crearModalOverlay = () => {
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "1000"
    });
    return overlay;
  };

  /**
   * Crea y estiliza el contenido del modal
   * @returns {HTMLElement} Elemento contenido del modal
   */
  const crearModalContent = () => {
    const content = document.createElement("div");
    Object.assign(content.style, {
      backgroundColor: "white",
      padding: "30px",
      borderRadius: "8px",
      maxWidth: "500px",
      width: "90%",
      maxHeight: "90vh",
      overflowY: "auto"
    });
    return content;
  };

  /**
   * Genera el HTML del formulario de edición
   * @param {Object} pelicula - Datos de la película
   * @returns {string} HTML del formulario
   */
  const generarFormularioEdicion = (pelicula) => `
    <h2 style="margin-top: 0;">Gestionar Película</h2>
    <form id="formEditarPelicula">
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Nombre:</label>
        <input type="text" id="editNombre" value="${pelicula.nombre}" 
               style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
      </div>
      
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Descripción:</label>
        <textarea id="editDescripcion" rows="4" 
                  style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>${pelicula.descripcion}</textarea>
      </div>
      
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Fecha de salida:</label>
        <input type="date" id="editFechaSalida" value="${formatearFecha(pelicula.fechaSalida)}" 
               style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
      </div>
      
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Imagen:</label>
        <input type="file" id="editUrlImagen" accept="image/*"
               style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
      </div>
      
      <div id="mensajeEdicion" style="margin-bottom: 15px; min-height: 20px;"></div>
      
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button type="button" id="btnCancelarEdicion" 
                style="padding: 10px 20px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Cancelar
        </button>
        <button type="submit" id="btnGuardarCambios"
                style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;"
                disabled>
          Guardar Cambios
        </button>
      </div>
    </form>
  `;

  /**
   * Muestra un mensaje de error en el modal
   * @param {HTMLElement} contenedor - Elemento donde mostrar el mensaje
   * @param {string} texto - Texto del mensaje
   */
  const mostrarErrorModal = (contenedor, texto) => {
    contenedor.innerHTML = `<p style='color:red'>${texto}</p>`;
  };

  /**
   * Valida que todos los campos obligatorios estén completos
   * @param {Object} campos - Objeto con referencias a los inputs
   * @returns {boolean} true si todos los campos están completos
   */
  const validarCamposModal = (campos) => {
    return Object.values(campos).every(campo => campo.value.trim() !== "");
  };

  /**
   * Configura la validación en tiempo real del modal
   * @param {Object} campos - Inputs del formulario
   * @param {HTMLElement} boton - Botón de guardar
   */
  const configurarValidacionModal = (campos, boton) => {
    const actualizarBoton = () => {
      boton.disabled = !validarCamposModal(campos);
    };

    Object.values(campos).forEach(campo => {
      campo.addEventListener("input", actualizarBoton);
    });

    actualizarBoton();
  };

  /**
   * Procesa y sube una nueva imagen si fue seleccionada
   * @param {HTMLInputElement} inputImagen - Input de archivo
   * @param {string} urlActual - URL actual de la imagen
   * @param {HTMLElement} mensajeContenedor - Contenedor para mensajes
   * @returns {Promise<string|null>} URL de la nueva imagen o null si hay error
   */
  const procesarNuevaImagen = async (inputImagen, urlActual, mensajeContenedor) => {
    if (inputImagen.files.length === 0) {
      return urlActual;
    }

    const imagenFile = inputImagen.files[0];
    
    if (!validarImagen(imagenFile)) {
      mostrarErrorModal(mensajeContenedor, "El archivo debe ser una imagen válida.");
      inputImagen.value = "";
      return null;
    }

    try {
      return await subirImagenCloudinary(imagenFile);
    } catch (error) {
      console.error("Error al subir imagen:", error);
      mostrarErrorModal(mensajeContenedor, "Error al subir la imagen a Cloudinary.");
      return null;
    }
  };

  /**
   * Abre el modal de edición de película
   * @param {Object} pelicula - Datos de la película a editar
   */
  const abrirModalEdicion = (pelicula) => {
    // Crear estructura del modal
    const modalOverlay = crearModalOverlay();
    const modalContent = crearModalContent();
    modalContent.innerHTML = generarFormularioEdicion(pelicula);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Referencias a elementos del modal
    const elementos = {
      editNombre: document.getElementById("editNombre"),
      editDescripcion: document.getElementById("editDescripcion"),
      editFechaSalida: document.getElementById("editFechaSalida"),
      editUrlImagen: document.getElementById("editUrlImagen"),
      btnGuardarCambios: document.getElementById("btnGuardarCambios"),
      btnCancelarEdicion: document.getElementById("btnCancelarEdicion"),
      mensajeEdicion: document.getElementById("mensajeEdicion"),
      formEditarPelicula: document.getElementById("formEditarPelicula")
    };

    // Configurar validación de campos
    configurarValidacionModal({
      nombre: elementos.editNombre,
      descripcion: elementos.editDescripcion,
      fecha: elementos.editFechaSalida
    }, elementos.btnGuardarCambios);

    // Cerrar modal al hacer clic en el overlay
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        document.body.removeChild(modalOverlay);
      }
    });

    // Botón cancelar
    elementos.btnCancelarEdicion.addEventListener("click", () => {
      document.body.removeChild(modalOverlay);
    });

    // Manejar submit del formulario
    elementos.formEditarPelicula.addEventListener("submit", async (e) => {
      e.preventDefault();
      elementos.mensajeEdicion.innerHTML = "";

      // Procesar imagen
      const nuevaUrlImagen = await procesarNuevaImagen(
        elementos.editUrlImagen,
        pelicula.urlImagen,
        elementos.mensajeEdicion
      );

      if (nuevaUrlImagen === null) return;

      // Preparar datos actualizados
      const peliculaActualizada = {
        id: pelicula.id,
        nombre: elementos.editNombre.value.trim(),
        descripcion: elementos.editDescripcion.value.trim(),
        fechaSalida: elementos.editFechaSalida.value.trim(),
        urlImagen: nuevaUrlImagen
      };

      // Enviar actualización
      try {
        await actualizarPelicula(peliculaActualizada);
        alert(`Película "${peliculaActualizada.nombre}" actualizada.`);
        document.body.removeChild(modalOverlay);
        cargarPeliculas(filtroInput.value, selectOcultos.value);
      } catch (error) {
        console.error("Error actualizando película:", error);
        mostrarErrorModal(elementos.mensajeEdicion, "Error al actualizar la película.");
      }
    });
  };

  // ========================================
  // FUNCIONES DE SPINNER
  // ========================================

  /**
   * Muestra un spinner de carga
   */
  const mostrarSpinner = () => {
    campoInfo.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; padding: 40px;">
        <div style="
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        "></div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
  };

  // ========================================
  // FUNCIONES DE RENDERIZADO
  // ========================================

  /**
   * Crea el contenedor de imagen para una película
   * @param {Object} pelicula - Datos de la película
   * @returns {HTMLElement} Contenedor con la imagen
   */
  const crearContenedorImagen = (pelicula) => {
    const imgContainer = document.createElement("div");
    Object.assign(imgContainer.style, {
      width: "300px",
      height: "150px",
      margin: "0 auto 12px",
      borderRadius: "6px",
      overflow: "hidden",
      backgroundColor: "#f5f5f5",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    });

    const img = document.createElement("img");
    img.src = pelicula.urlImagen || "";
    img.alt = `Portada de ${pelicula.nombre}`;
    Object.assign(img.style, {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      display: "block",
      backgroundColor: "white"
    });

    img.onerror = () => {
      img.style.display = "none";
    };

    imgContainer.appendChild(img);
    return imgContainer;
  };

  /**
   * Crea un botón de acción para una película
   * @param {string} clase - Clase CSS del botón
   * @param {string} texto - Texto del botón
   * @param {Function} onClick - Función a ejecutar al hacer clic
   * @returns {HTMLElement} Botón creado
   */
  const crearBoton = (clase, texto, onClick) => {
    const boton = document.createElement("button");
    boton.classList.add(clase);
    boton.textContent = texto;
    boton.addEventListener("click", onClick);
    return boton;
  };

  /**
   * Crea la tarjeta de una película con todos sus elementos
   * @param {Object} pelicula - Datos de la película
   * @returns {HTMLElement} Tarjeta de película completa
   */
  const crearTarjetaPelicula = (pelicula) => {
    const item = document.createElement("div");
    item.classList.add("movie-item");
    Object.assign(item.style, {
      display: "flex",
      flexDirection: "column"
    });

    // Crear botones de acción
    const btnEditar = crearBoton("btn-editar", "Editar", () => {
      abrirModalEdicion(pelicula);
    });
    btnEditar.style.marginTop = "auto";

    const btnDesactivar = crearBoton("btn-desactivar", "Desactivar", async () => {
      await eliminarPeliculaLogica(pelicula.id);
      alert(`Película "${pelicula.nombre}" desactivada.`);
      cargarPeliculas(filtroInput.value, selectOcultos.value);
    });

    const btnEliminar = crearBoton("btn-eliminar", "Eliminar", async () => {
      await eliminarPeliculaFisica(pelicula.id);
      alert(`Película "${pelicula.nombre}" eliminada.`);
      cargarPeliculas(filtroInput.value, selectOcultos.value);
    });

    // Crear contenedor de imagen
    const imgContainer = crearContenedorImagen(pelicula);

    // Agregar información de la película
    item.innerHTML = `
      <h3 style="word-wrap: break-word; overflow-wrap: break-word;">Nombre: ${pelicula.nombre}</h3>
      <p style="word-wrap: break-word; overflow-wrap: break-word;">Descripción: ${pelicula.descripcion}</p>
      <p style="word-wrap: break-word; overflow-wrap: break-word;">Fecha de salida: ${new Date(pelicula.fechaSalida).toLocaleDateString()}</p>
    `;

    // Ensamblar tarjeta
    item.insertBefore(imgContainer, item.firstChild);
    item.appendChild(btnEditar);
    item.appendChild(btnDesactivar);
    item.appendChild(btnEliminar);

    return item;
  };

  /**
   * Carga y muestra la lista de películas con filtro opcional
   * @param {string} filtro - Texto para filtrar por nombre
   * @param {string} mostrarOculta - "true" para solo activos, "false" para todos
   */
  const cargarPeliculas = async (filtro = "", mostrarOculta = "false") => {
    // Mostrar spinner mientras carga
    mostrarSpinner();
    try {
      
      const mostrarSoloActivos = mostrarOculta === "true";
      let peliculas = await obtenerPeliculas(mostrarSoloActivos);
      
      // Aplicar filtro por nombre
      if (filtro.trim() !== "") {
        peliculas = peliculas.filter(p => 
          p.nombre.toLowerCase().includes(filtro.toLowerCase())
        );
      }

      campoInfo.innerHTML = "";

      // Manejar lista vacía
      if (peliculas.length === 0) {
        campoInfo.innerHTML = "<p>No hay películas para mostrar.</p>";
        return;
      }

      // Renderizar cada película
      peliculas.forEach(pelicula => {
        const tarjeta = crearTarjetaPelicula(pelicula);
        campoInfo.appendChild(tarjeta);
      });

    } catch (error) {
      console.error("Error cargando películas:", error);
      campoInfo.innerHTML = "<p>No se pudieron cargar las películas.</p>";
    }
  };

  // ========================================
  // EVENTOS DE FILTRADO
  // ========================================

  // Búsqueda al hacer clic en el botón
  btnBuscarFiltro.addEventListener("click", () => {
    if (filtroInput.value) {
      cargarPeliculas(filtroInput.value, selectOcultos.value);
    }
  });

  // Limpiar filtro al borrar el input
  filtroInput.addEventListener("input", () => {
    if (filtroInput.value.trim() === "") {
      cargarPeliculas("", selectOcultos.value);
    }
  });

  // Cambio en el select de ocultos
  selectOcultos.addEventListener("change", () => {
    cargarPeliculas(filtroInput.value, selectOcultos.value);
  });

  // ========================================
  // CARGA INICIAL
  // ========================================
  cargarPeliculas();
});