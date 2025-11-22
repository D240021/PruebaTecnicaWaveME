# 🎬 Prueba Técnica WaveME — Gestión de Películas

Este proyecto es una solución completa desarrollada como parte de una prueba técnica para **WaveME**.  
Incluye un **frontend** en JavaScript y un **backend RESTful en .NET**, con funcionalidades de gestión y visualización de películas.

---

## 🚀 Tecnologías Utilizadas

### **Frontend**
- HTML5 + CSS3 (Responsive)
- JavaScript (ES6+)
- Fetch API
- Grid Layout / Flexbox

### **Backend**
- C# — .NET 8 Web API
- Entity Framework Core
- SQL Server
- DTOs y Servicios para manejo de la lógica

  ### **Servicios externos**
- Cloudinary para almacenar las imágenes de las películas

---

## 🎯 Funcionalidades

### ✔ Listado de Películas
- Obtiene películas desde la API REST mediante `fetch`.
- Renderiza tarjetas con imagen, nombre, descripción y fecha de salida.

### ✔ Filtros
- **Búsqueda por nombre** en tiempo real.
- **Filtro por películas activas o todas** mediante query string:
