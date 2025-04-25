import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const AuthForm = ({ isLogin = true }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      
      if (isLogin) {
        response = await authService.login({ email, password });
      } else {
        response = await authService.register({ name, email, password });
      }

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      navigate('/contacts');
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Error de conexión. Inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4 shadow">
      <h2 className="text-center mb-4">
        {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
      </h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={onSubmit}>
        {!isLogin && (
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              required
            />
          </div>
        )}
        
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            isLogin ? 'Iniciar Sesión' : 'Registrarse'
          )}
        </button>
      </form>
      
      <div className="mt-3 text-center">
        {isLogin ? (
          <p>
            ¿No tienes una cuenta?{' '}
            <a href="#" onClick={() => navigate('/register')}>
              Regístrate
            </a>
          </p>
        ) : (
          <p>
            ¿Ya tienes una cuenta?{' '}
            <a href="#" onClick={() => navigate('/login')}>
              Inicia sesión
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;