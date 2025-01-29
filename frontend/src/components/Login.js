import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import '../pages/LoginPage.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const role = await login(username, password);
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'LIBRARIAN') navigate('/librarian');
      else if (role === 'STUDENT') navigate('/student');
      else setError('Rol no reconocido.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      {/* 🔹 Texto "Sistema Bibliotecario" agregado */}
      <h1 className="library-title">Sistema Bibliotecario</h1>

      <div className="login-box">
        <h3>Iniciar Sesión</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
        </form>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
}

export default Login;
