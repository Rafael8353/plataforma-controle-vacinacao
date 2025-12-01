import { useState, useEffect } from 'react';
import api from '../services/api';
import './Dashboard.css'; // Reaproveita estilos globais
import './CarteiraVacinacao.css'; // Estilos específicos

function CarteiraVacinacao({ onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await api.getPatientHistory();
      setHistory(data || []);
    } catch (err) {
      setError('Erro ao carregar histórico.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <p className="breadcrumb">Dashboard → Minha Carteira</p>
          <div className="logo-section">
            <button className="logout-button" onClick={onBack} style={{padding: '0.5rem', border: 'none'}}>
               {/* Ícone de Voltar */}
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
               </svg>
            </button>
            <div>
              <h2 className="logo-title">Histórico Completo</h2>
              <p className="logo-subtitle">Timeline de imunização</p>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <p className="loading-message">Carregando histórico...</p>
        ) : error ? (
          <div className="error-banner"><p>{error}</p></div>
        ) : history.length === 0 ? (
           <div className="empty-message">Nenhuma vacina registrada ainda.</div>
        ) : (
          <div className="timeline-container">
            {history.map((record, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-date">{formatDate(record.application_date)}</div>
                
                <div className="timeline-card">
                  <div className="timeline-header">
                    <div>
                      <h3 className="timeline-vaccine-name">{record.vaccine_name}</h3>
                      <p className="timeline-manufacturer">{record.vaccine_manufacturer}</p>
                    </div>
                    <span className="mobile-date" style={{color: '#888', fontSize: '0.85rem'}}>
                      {formatDate(record.application_date)}
                    </span>
                  </div>
                  
                  <div className="timeline-details">
                    <div className="detail-item">
                      <label>Dose</label>
                      <span>{record.dose_info || 'Única'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Lote</label>
                      <span>{record.lot_number}</span>
                    </div>
                    <div className="detail-item">
                      <label>Local</label>
                      <span>{record.location}</span>
                    </div>
                    <div className="detail-item">
                      <label>Aplicador</label>
                      <span>{record.professional_name}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CarteiraVacinacao;