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
  const [certificate, setCertificate] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateError, setCertificateError] = useState(null);
  const [generatingCertificate, setGeneratingCertificate] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Carregar dados do usuário
      const userData = await api.getCurrentUser().catch(err => {
        console.warn('Erro ao carregar dados do usuário:', err);
        return null;
      });
      
      if (userData) {
        setUserName(userData.name || 'Usuário');
      }
      
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

  const formatDateShort = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleGenerateCertificate = async () => {
    try {
      setGeneratingCertificate(true);
      setCertificateError(null);
      
      const cert = await api.getCertificate();
      setCertificate(cert);
      setShowCertificate(true);
    } catch (err) {
      setCertificateError(err.message || 'Erro ao gerar certificado. Verifique se seu cadastro está completo (CPF e Cartão SUS).');
    } finally {
      setGeneratingCertificate(false);
    }
  };

  const handleDownloadCertificate = () => {
    if (!certificate) return;

    const content = `
CERTIFICADO DE VACINAÇÃO
VacinaCard - Sistema de Gestão de Vacinação

DADOS DO PACIENTE
Nome: ${certificate.user_info.full_name}
CPF: ${certificate.user_info.cpf}
Data de Nascimento: ${formatDateShort(certificate.user_info.birth_date)}
Cartão SUS: ${certificate.user_info.sus_card_number}

VACINAS APLICADAS
${certificate.vaccinations.map((v, i) => `
${i + 1}. ${v.vaccine_name}
   Fabricante: ${v.manufacturer}
   Data de Aplicação: ${formatDateShort(v.application_date)}
   Dose: ${v.dose}
   Lote: ${v.lot.number}
   Validade do Lote: ${formatDateShort(v.lot.expiration_date)}
   Aplicador: ${v.applicator.name} (Registro: ${v.applicator.register})
`).join('')}

Certificado emitido em: ${formatDateShort(certificate.issued_at)}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificado-vacinacao-${certificate.user_info.cpf}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            <h2 className="section-title">Certificado de Vacinação</h2>
            <p className="section-subtitle">Gere seu certificado completo de vacinação</p>
          </div>
          
          <div className="certificate-card">
            <p>Clique no botão abaixo para gerar seu certificado de vacinação com todas as vacinas aplicadas.</p>
            {certificateError && (
              <div className="error-message" style={{ marginBottom: '1rem' }}>
                {certificateError}
              </div>
            )}
            <button 
              onClick={handleGenerateCertificate} 
              className="certificate-button"
              disabled={generatingCertificate}
            >
              {generatingCertificate ? 'Gerando...' : 'Gerar Certificado'}
            </button>
          </div>
        </div>

        {showCertificate && certificate && (
          <div className="certificate-modal-overlay" onClick={() => setShowCertificate(false)}>
            <div className="certificate-modal" onClick={(e) => e.stopPropagation()}>
              <div className="certificate-modal-header">
                <h2>Certificado de Vacinação</h2>
                <button className="close-button" onClick={() => setShowCertificate(false)}>×</button>
              </div>
              <div className="certificate-content">
                <div className="certificate-section">
                  <h3>Dados do Paciente</h3>
                  <p><strong>Nome:</strong> {certificate.user_info.full_name}</p>
                  <p><strong>CPF:</strong> {certificate.user_info.cpf}</p>
                  <p><strong>Data de Nascimento:</strong> {formatDateShort(certificate.user_info.birth_date)}</p>
                  <p><strong>Cartão SUS:</strong> {certificate.user_info.sus_card_number}</p>
                </div>

                <div className="certificate-section">
                  <h3>Vacinas Aplicadas</h3>
                  {certificate.vaccinations.length > 0 ? (
                    <div className="vaccination-list">
                      {certificate.vaccinations.map((vaccination, index) => (
                        <div key={index} className="vaccination-item">
                          <h4>{vaccination.vaccine_name}</h4>
                          <p><strong>Fabricante:</strong> {vaccination.manufacturer}</p>
                          <p><strong>Data de Aplicação:</strong> {formatDateShort(vaccination.application_date)}</p>
                          <p><strong>Dose:</strong> {vaccination.dose}</p>
                          <p><strong>Lote:</strong> {vaccination.lot.number}</p>
                          <p><strong>Validade do Lote:</strong> {formatDateShort(vaccination.lot.expiration_date)}</p>
                          <p><strong>Aplicador:</strong> {vaccination.applicator.name} (Registro: {vaccination.applicator.register})</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Nenhuma vacina registrada.</p>
                  )}
                </div>

                <div className="certificate-footer">
                  <p><strong>Certificado emitido em:</strong> {formatDateShort(certificate.issued_at)}</p>
                </div>

                <div className="certificate-actions">
                  <button onClick={handleDownloadCertificate} className="download-button">
                    Baixar Certificado
                  </button>
                  <button onClick={() => setShowCertificate(false)} className="close-modal-button">
                    Fechar
                  </button>
                </div>
              </div>
            </div>
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
                    <p className="vaccine-date">{formatDate(vaccine.next_dose_date)}</p>
                    {vaccine.dose_info && (
                      <p className="vaccine-dose-info" style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.25rem' }}>
                        {vaccine.dose_info}
                      </p>
                    )}
                  </div>
                  <span className="vaccine-status pending">Pendente</span>
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

