import { useState, useEffect } from 'react';
import api from '../services/api';
import './Dashboard.css';

function DashboardPaciente({ userToken, onLogout }) {
  const [userName, setUserName] = useState('');
  const [upcomingVaccines, setUpcomingVaccines] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    upcoming: 0,
    history: 0,
    status: 'Em dia'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Carregar próximas vacinas
      const upcoming = await api.getUpcomingVaccines().catch(err => {
        console.warn('Erro ao carregar próximas vacinas:', err);
        return [];
      });
      setUpcomingVaccines(upcoming || []);
      
      // Carregar histórico
      const historyData = await api.getPatientHistory().catch(err => {
        console.warn('Erro ao carregar histórico:', err);
        return [];
      });
      setHistory(historyData || []);
      
      // Calcular estatísticas
      setStats({
        upcoming: upcoming?.length || 0,
        history: historyData?.length || 0,
        status: 'Em dia'
      });
      
      // Simular nome do usuário (em produção, buscar do backend)
      setUserName('Maria Silva');
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      setError('Erro ao carregar dados. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <p className="breadcrumb">Dashboard → Paciente</p>
          <div className="logo-section">
            <svg className="pencil-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.12 5.12L18.87 8.87L20.71 7.04Z" fill="#4A90E2"/>
            </svg>
            <div>
              <h2 className="logo-title">VacinaCard</h2>
              <p className="logo-subtitle">Área do paciente</p>
            </div>
          </div>
        </div>
        <button className="logout-button" onClick={onLogout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.59L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor"/>
          </svg>
          Sair
        </button>
      </div>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1 className="welcome-title">Olá, {userName}!</h1>
          <p className="welcome-subtitle">Acompanhe suas vacinas e mantenha sua saúde em dia</p>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon calendar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H5C3.89 4 3 4.9 3 6V20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Próximas vacinas</p>
              <p className="stat-value">{stats.upcoming}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon document">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Histórico</p>
              <p className="stat-value">{stats.history}</p>
            </div>
          </div>

          <div className="stat-card status-card">
            <div className="stat-icon pencil">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.12 5.12L18.87 8.87L20.71 7.04Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Status</p>
              <p className="stat-value status-value">{stats.status}</p>
              <p className="stat-sublabel">Carteira atualizada</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={loadDashboardData} className="retry-button">Tentar novamente</button>
          </div>
        )}

        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Próximas vacinas</h2>
            <p className="section-subtitle">Vacinas programadas para você</p>
          </div>

          {loading ? (
            <p className="loading-message">Carregando...</p>
          ) : upcomingVaccines.length > 0 ? (
            <div className="vaccine-list">
              {upcomingVaccines.map((vaccine, index) => (
                <div key={index} className="vaccine-item">
                  <div className="vaccine-info">
                    <h3 className="vaccine-name">{vaccine.vaccine_name || 'Vacina'}</h3>
                    <p className="vaccine-date">{formatDate(vaccine.scheduled_date || vaccine.next_dose_date)}</p>
                  </div>
                  <span className="vaccine-status pending">
                    {vaccine.status === 'scheduled' ? 'Agendada' : 'Pendente'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">Nenhuma vacina agendada no momento.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPaciente;

