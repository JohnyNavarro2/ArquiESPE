import React, { useEffect, useState } from 'react';
import { getAllUsers, createUser, updateUser, suspendUser, activateUser, deleteUser } from '../services/userService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminPage.css';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('suspendActivate');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: '',
    idInstitucional: '',
    status: true
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error.message);
    }
  };

  // Definición de handleDelete para eliminar un usuario
  const handleDelete = async (idInstitucional) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        const response = await fetch(`http://localhost:8081/api/users/${idInstitucional}`, {
          method: "DELETE",
        });
  
        if (response.ok) {
          alert("Usuario eliminado con éxito");
          // Actualiza la lista de usuarios en la UI
          setUsers(users.filter(user => user.idInstitucional !== idInstitucional));
        } else {
          alert("Error al eliminar el usuario");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  
  //Definiendo handleSelectUser para seleccionar un usuario
  const handleSelectUser = (idInstitucional) => {
    const user = users.find(user => user.idInstitucional === idInstitucional);
    if (user) {
      setSelectedUserId(user.id);
      setFormData({
        username: user.username,
        password: '', // La contraseña no debe mostrarse por razones de seguridad
        role: user.role,
        idInstitucional: user.idInstitucional,
        status: user.status
      });
    }
  };

  // Definición de handleSuspendActivate
  const handleSuspendActivate = async (user) => {
    try {
      if (user.status) {
        await suspendUser(user.idInstitucional);
      } else {
        await activateUser(user.idInstitucional);
      }
      fetchUsers(); // Refresca la lista de usuarios después de actualizar su estado.
    } catch (error) {
      console.error('Error al suspender/activar el usuario:', error.message);
    }
  };

// Definición de handleFormSubmit para guardar un usuario en la base de datos o actualizarlo
  const handleFormSubmit = async () => {
    if (!formData.username || !formData.password || !formData.role || !formData.idInstitucional) {
      alert('Todos los campos son obligatorios.');
      return;
    }
  
    try {
      if (selectedUserId) {
        await updateUser(formData.idInstitucional, formData);
      } else {
        await createUser(formData);
      }
  
      // 🔹 Recargar la lista de usuarios
      fetchUsers();
  
      // 🔹 Limpiar el formulario completamente
      setFormData({ 
        username: '', 
        password: '', 
        role: '', 
        idInstitucional: '',  // 🔹 Ahora también limpia el ID Institucional
        status: true 
      });
  
      setSearchTerm(''); // 🔹 Limpia la búsqueda
      setSelectedUserId(null); // 🔹 Deselecciona usuario
  
    } catch (error) {
      console.error('Error al guardar el usuario:', error.message);
    }
  };

  return (
    <div className="admin-page">
      <header className="header">
        <nav className="nav nav-tabs">
          <button onClick={() => setActiveTab('suspendActivate')} className={`nav-link ${activeTab === 'suspendActivate' ? 'active' : ''}`}>
            Suspender/Activar
          </button>
          <button onClick={() => setActiveTab('addUser')} className={`nav-link ${activeTab === 'addUser' ? 'active' : ''}`}>
            Agregar Usuario
          </button>
          <button onClick={() => setActiveTab('editUser')} className={`nav-link ${activeTab === 'editUser' ? 'active' : ''}`}>
            Editar Usuario
          </button>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="btn btn-danger ms-auto">
            Cerrar Sesión
          </button>
        </nav>
      </header>

      <main className="mt-4">
        {activeTab === 'suspendActivate' && (
          <div>
            <h1>Gestión de Usuarios</h1>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th></th>
                  <th>ID Institucional</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <input
                        type="radio"
                        name="selectedUser"
                        checked={selectedUserId === user.id}
                        onChange={() => setSelectedUserId(user.id)}
                      />
                    </td>
                    <td>{user.idInstitucional}</td>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>{user.status ? 'Activo' : 'Suspendido'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleSuspendActivate(user)}
                          className={`btn ${user.status ? 'btn-warning' : 'btn-success'}`}
                        >
                          <i className="bi bi-pause"></i> {user.status ? 'Suspender' : 'Activar'}
                        </button>

                        <button
                          onClick={() => handleDelete(user.idInstitucional)}
                          className="btn btn-danger"
                        >
                          <i className="bi bi-trash"></i> Eliminar
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'addUser' && (
          <div>
            <h1>Agregar Usuario</h1>
            <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }}>
              <div className="mb-3">
                <label className="form-label">ID Institucional</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.idInstitucional}
                  onChange={(e) => setFormData({ ...formData, idInstitucional: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="">Seleccionar Rol</option>
                  <option value="1">Administrador</option>
                  <option value="2">Bibliotecario</option>
                  <option value="3">Estudiante</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Guardar</button>
            </form>
          </div>
        )}

        {activeTab === 'editUser' && (
          <div>
            <h1>Editar Usuario</h1>
            <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }}>
              <div className="mb-3">
                <label className="form-label">Buscar ID Institucional</label>
                <input
                  type="text"
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyUp={(e) => handleSelectUser(e.target.value)}
                  list="idInstitucionales"
                  placeholder="Escribe para buscar..."
                />
                <datalist id="idInstitucionales">
                  {users.map(user => (
                    <option key={user.id} value={user.idInstitucional} />
                  ))}
                </datalist>
              </div>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="">Seleccionar Rol</option>
                  <option value="1">Administrador</option>
                  <option value="2">Bibliotecario</option>
                  <option value="3">Estudiante</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Estado</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value === 'true' })}
                  required
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>

                </select>
              </div>
              <button type="submit" className="btn btn-primary">Guardar Cambios</button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}

export default AdminPage;
