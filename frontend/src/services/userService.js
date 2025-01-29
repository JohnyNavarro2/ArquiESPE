import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

// Obtiene todos los usuarios de la base de datos
export const getAllUsers = async () => {
  const username = localStorage.getItem('username'); // Recupera el username almacenado
  if (!username) {
    throw new Error('El usuario no está autenticado.');
  }

  const response = await axios.get(API_URL, {
    headers: { username }, // Envía el encabezado
  });
  return response.data;
};

// Obtiene un usuario específico de la base de datos con el idInstitucional proporcionado
export const deleteUser = async (idInstitucional) => {
  const username = localStorage.getItem('username');
  if (!username) {
    throw new Error('El usuario no está autenticado.');
  }

  try {
    await axios.delete(`${API_URL}/${idInstitucional}`, {
      headers: { username },
    });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error.response ? error.response.data : 'No hay respuesta del servidor');
    throw error;
  }
};


// Crea un nuevo usuario en la base de datos con los datos proporcionados en userData
export const createUser = async (userData) => {
  const username = localStorage.getItem('username');
  if (!username) {
    throw new Error('El usuario no está autenticado.');
  }

  try {
    await axios.post(API_URL, userData, {
      headers: { username },
    });
  } catch (error) {
    console.error('Error al crear usuario:', error.response ? error.response.data : 'No hay respuesta del servidor');
    throw error;
  }
};



// **Actualiza un usuario con `idInstitucional` correctamente**
export const updateUser = async (idInstitucional, userData) => {
  const username = localStorage.getItem('username');
  if (!username) {
    throw new Error('El usuario no está autenticado.');
  }

  if (!idInstitucional) {
    throw new Error('El ID Institucional no es válido.');
  }

  try {
    const response = await axios.put(`${API_URL}/${idInstitucional}`, userData, {
      headers: { username },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar usuario:', error.response ? error.response.data : 'No hay respuesta del servidor');
    throw error;
  }
};

// Suspende un usuario existente en la base de datos con el idInstitucional proporcionado
export const suspendUser = async (idInstitucional) => {
  const username = localStorage.getItem('username'); 
  if (!username) {
    throw new Error('El usuario no está autenticado.');
  }

  await axios.put(`${API_URL}/${idInstitucional}/suspend`, null, {
    headers: { username }, 
  });
};

// Activa un usuario existente en la base de datos con el idInstitucional proporcionado
export const activateUser = async (idInstitucional) => {
  const username = localStorage.getItem('username'); 
  if (!username) {
    throw new Error('El usuario no está autenticado.');
  }

  await axios.put(`${API_URL}/${idInstitucional}/activate`, null, {
    headers: { username }, 
  });
};
