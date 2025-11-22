import { useState, useEffect } from 'react';
import api from '../services/api';
import './Dashboard.css';

function DashboardProfissional({ userToken, onLogout }) {
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    atendimentosHoje: 0,
    totalPacientes: 0,
    estoqueBaixo: 0,
    aplicacoesHoje: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Carregar dados do usuário
      const userData = await api.getCurrentUser().catch(err => {
        console.warn('Erro ao carregar dados do usuário:', err);
        return null;
      });
      
      if (userData) {
        // Adicionar prefixo Dr. se for profissional de saúde
        const name = userData.name || 'Usuário';
        setUserName(userData.role === 'health_professional' ? `Dr. ${name}` : name);
      }
      
      // Carregar dados do estoque
      const lots = await api.getVaccineLots().catch(() => []);
      
      // Calcular estoque baixo (lotes com quantidade atual menor que 10 ou vencidos)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lowStock = lots.filter(lot => {
        const expiryDate = new Date(lot.expiry_date);
        expiryDate.setHours(0, 0, 0, 0);
        return (lot.quantity_current < 10) || (expiryDate < today);
      }).length;
      
      // Buscar estatísticas do profissional
      const professionalStats = await api.getProfessionalStats().catch(err => {
        console.warn('Erro ao carregar estatísticas do profissional:', err);
        return {
          atendimentosHoje: 0,
          totalPacientes: 0,
          aplicacoesHoje: 0
        };
      });
      
      // Estatísticas baseadas em dados reais do backend
      setStats({
        atendimentosHoje: professionalStats.atendimentosHoje || 0,
        totalPacientes: professionalStats.totalPacientes || 0,
        estoqueBaixo: lowStock,
        aplicacoesHoje: professionalStats.aplicacoesHoje || 0
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <p className="breadcrumb">Dashboard → Profissional</p>
          <div className="logo-section">
            <svg className="pencil-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.12 5.12L18.87 8.87L20.71 7.04Z" fill="#4A90E2"/>
            </svg>
            <div>
              <h2 className="logo-title">VacinaCard</h2>
              <p className="logo-subtitle">Área do Profissional</p>
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
          <h1 className="welcome-title">Bem-vindo, {userName}!</h1>
          <p className="welcome-subtitle">Gerencie aplicações de vacinas e acompanhe o estoque.</p>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon calendar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H5C3.89 4 3 4.9 3 6V20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Atendimentos hoje</p>
              <p className="stat-value">{stats.atendimentosHoje}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon document">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Total de pacientes</p>
              <p className="stat-value">{stats.totalPacientes}</p>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon warning-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Estoque baixo</p>
              <p className="stat-value">{stats.estoqueBaixo}</p>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon pencil">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.12 5.12L18.87 8.87L20.71 7.04Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Aplicações hoje</p>
              <p className="stat-value">{stats.aplicacoesHoje}</p>
            </div>
          </div>
        </div>

        <div className="action-cards">
          <div className="action-card primary">
            <div className="action-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.12 5.12L18.87 8.87L20.71 7.04Z" fill="#4A90E2"/>
              </svg>
            </div>
            <h3 className="action-title">Aplicar vacina</h3>
            <p className="action-subtitle">Registrar nova aplicação de vacina</p>
            <button className="action-button primary-button">Iniciar aplicação</button>
          </div>

          <div className="action-card">
            <div className="action-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6H16L14 4H10L8 6H4C2.9 6 2 6.9 2 8V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V8C22 6.9 21.1 6 20 6ZM20 19H4V8H20V19Z" fill="#4A90E2"/>
              </svg>
            </div>
            <h3 className="action-title">Gestão de estoque</h3>
            <p className="action-subtitle">Gerenciar lotes e validades</p>
            <button className="action-button secondary-button">Ver estoque</button>
          </div>

          <div className="action-card">
            <div className="action-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="#4A90E2"/>
                <path d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H13V17H7V15Z" fill="#4A90E2"/>
              </svg>
            </div>
            <h3 className="action-title">Gestão de vacinas</h3>
            <p className="action-subtitle">Gerenciar todos os tipos de vacinas</p>
            <button className="action-button secondary-button">Gerenciar vacinas</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardProfissional;

