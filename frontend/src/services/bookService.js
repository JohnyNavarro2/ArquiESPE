import axios from 'axios';

const API_URL = 'http://localhost:8080/api/books';

// Obtener todos los libros
export const getAllBooks = async () => {
  const username = localStorage.getItem('username'); // Recupera el username almacenado
  if (!username) {
    throw new Error('El usuario no está en el sistema')
  }

  const response = await axios.get(API_URL, {
    headers: { username }, // Envía el encabezado con el username
  });
  return response.data;
};

// Crear un nuevo libro
export const addBook = async (bookData) => {
  const username = localStorage.getItem('username');
  if (!username) {
      throw new Error('El usuario no está autenticado.');
  }

  try {
      await axios.post(API_URL, bookData, {
          headers: { 'Content-Type': 'application/json', username }
      });
  } catch (error) {
      // Añadir manejo del error aquí
      if (error.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          console.error("Error data:", error.response.data);
          console.error("Error status:", error.response.status);
          throw new Error(`Error al guardar el libro: ${error.response.data.message}`);
      } else if (error.request) {
          // La solicitud fue hecha pero no se recibió respuesta
          console.error("No response:", error.request);
          throw new Error("No se recibió respuesta del servidor");
      } else {
          // Algo más causó el error
          console.error("Error message:", error.message);
          throw new Error(error.message);
      }
  }
};

// Actualizar un libro existente
export const updateBook = async (id, bookData) => {
  const username = localStorage.getItem('username'); // Recupera el username desde localStorage
  if (!username) {
    throw new Error('El usuario no está autenticado.');
  }

  await axios.put(`${API_URL}/${id}`, bookData, {
    headers: { username }, // Envía el encabezado correctamente
  });
};

// Eliminar un libro
export const deleteBook = async (id) => {
  const username = localStorage.getItem('username'); 
  if (!username) {
    throw new Error('El usuario no está autenticado.');
  }

  await axios.delete(`${API_URL}/${id}`, {
    headers: { username }, 
  });
};

// Buscar libro por ISBN
export const getBookByIsbn = async (isbn) => {
  const username = localStorage.getItem('username');
  if (!username) {
    throw new Error('El usuario no está autenticado.');
  }

  const response = await axios.get(`${API_URL}/isbn/${isbn}`, {
    headers: { username },
  });
  return response.data;
};

// Buscar libros por título
export const getBooksByTitle = async (title) => {
  const username = localStorage.getItem('username');
  if (!username) {
    throw new Error('El usuario no está autenticado.');
  }

  const response = await axios.get(`${API_URL}/title/${title}`, {
    headers: { username },
  });
  return response.data;
};

// Buscar libros por autor
export const getBooksByAuthor = async (author) => {
  const username = localStorage.getItem('username');
  if (!username) {
    throw new Error('El usuario no está autenticado.');
  }

  const response = await axios.get(`${API_URL}/author/${author}`, {
    headers: { username },
  });
  return response.data;
};

// Filtrar libros por categoría, estado, o rango de años
export const filterBooks = async (filters) => {
  const username = localStorage.getItem('username');
  if (!username) {
    throw new Error('El usuario no está autenticado.');
  }

  const { category, status, yearFrom, yearTo } = filters;
  const params = {
    ...(category && { category }),
    ...(status && { status }),
    ...(yearFrom && { yearFrom }),
    ...(yearTo && { yearTo }),
  };

  const response = await axios.get(`${API_URL}/filter`, {
    headers: { username },
    params, // Envía los filtros como parámetros de consulta
  });
  return response.data;
};
