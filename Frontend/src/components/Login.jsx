import { useState } from 'react';
import api from '../services/api';
import './Login.css';

function Login({ onSwitchToRegister, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login(formData.identifier, formData.password);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        if (onLoginSuccess) {
          onLoginSuccess(response.token);
        }
      }
    } catch (err) {
      setError(err.message || 'Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="form-card">
        <div className="form-header">
          <svg className="pencil-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.12 5.12L18.87 8.87L20.71 7.04Z" fill="#4A90E2"/>
          </svg>
          <h1 className="brand-title">VacinaCard</h1>
          <p className="brand-subtitle">Sistema de Gestão de Vacinação</p>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-group">
            <label htmlFor="identifier">Email/CPF</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              placeholder="seu@gmail.com ou CPF"
              value={formData.identifier}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="switch-form">
            Não tem uma conta?{' '}
            <button type="button" className="link-button" onClick={onSwitchToRegister}>
              Cadastre-se
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;

