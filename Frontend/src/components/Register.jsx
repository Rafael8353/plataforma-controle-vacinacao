import { useState } from 'react';
import api from '../services/api';
import './Register.css';

function Register({ onSwitchToLogin, onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    dataNascimento: '',
    cpf: '',
    email: '',
    telefone: '',
    password: '',
    role: 'pacient',
    sus_card_number: '',
    professional_register: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.register(formData);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        if (onRegisterSuccess) {
          onRegisterSuccess(response.token);
        }
      }
    } catch (err) {
      setError(err.message || 'Erro ao cadastrar usuário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="form-card register-card">
        <div className="form-header">
          <svg className="pencil-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.12 5.12L18.87 8.87L20.71 7.04Z" fill="#4A90E2"/>
          </svg>
          <h1 className="brand-title">VacinaCard</h1>
          <p className="brand-subtitle">Preencha o formulário e se cadastre agora mesmo!</p>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-group">
            <label htmlFor="nomeCompleto">Nome</label>
            <input
              type="text"
              id="nomeCompleto"
              name="nomeCompleto"
              placeholder="Seu nome completo"
              value={formData.nomeCompleto}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dataNascimento">Data de Nascimento</label>
            <input
              type="date"
              id="dataNascimento"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cpf">CPF</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefone">Telefone</label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              placeholder="+51 999999999"
              value={formData.telefone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Digite uma senha</label>
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

          <div className="form-group">
            <label htmlFor="role">Tipo de Usuário</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="pacient">Paciente</option>
              <option value="health_professional">Profissional de Saúde</option>
            </select>
          </div>

          {formData.role === 'pacient' && (
            <div className="form-group">
              <label htmlFor="sus_card_number">Número do Cartão SUS</label>
              <input
                type="text"
                id="sus_card_number"
                name="sus_card_number"
                placeholder="000000000000000"
                value={formData.sus_card_number}
                onChange={handleChange}
              />
            </div>
          )}

          {formData.role === 'health_professional' && (
            <div className="form-group">
              <label htmlFor="professional_register">Registro Profissional</label>
              <input
                type="text"
                id="professional_register"
                name="professional_register"
                placeholder="Número do registro profissional"
                value={formData.professional_register}
                onChange={handleChange}
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Entrar'}
          </button>

          <p className="switch-form">
            Já tem uma conta?{' '}
            <button type="button" className="link-button" onClick={onSwitchToLogin}>
              Faça login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;

