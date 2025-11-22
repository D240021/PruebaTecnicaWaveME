const BASE_URL = 'http://localhost:5288/pelicula';

export const obtenerPeliculas = async () => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error(`Error al obtener películas: ${response.status}`);
    return await response.json();
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const crearPelicula = async (payload) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return response;
  } catch (e) {
    console.error(e);
  }
};

export const obtenerPeliculaPorId = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error(`Error al obtener la película ${id}: ${response.status}`);
    return await response.json();
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const actualizarPelicula = async (payload) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return response;
  } catch (e) {
    console.error(e);
  }
};

export const eliminarPeliculaFisica = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${encodeURIComponent(id)}/fisico`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    return response;
  } catch (e) {
    console.error(e);
  }
};

export const eliminarPeliculaLogica = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${encodeURIComponent(id)}/logico`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    return response;
  } catch (e) {
    console.error(e);
  }
};
