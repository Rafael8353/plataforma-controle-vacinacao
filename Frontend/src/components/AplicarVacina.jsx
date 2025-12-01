import { useState, useEffect } from 'react';
import api from '../services/api';
import './Dashboard.css';
import './AplicarVacina.css';

function AplicarVacina({ onBack }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [cpfSearch, setCpfSearch] = useState('');
  const [patient, setPatient] = useState(null);

  const [lots, setLots] = useState([]);
  const [selectedLotId, setSelectedLotId] = useState('');

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (step === 2) {
      loadAvailableLots();
    }
  }, [step]);

  const loadAvailableLots = async () => {
    try {
      const allLots = await api.getVaccineLots({ disponivel: true });
      setLots(allLots || []);
    } catch (err) {
      setError('Erro ao carregar lotes de vacina.');
    }
  };

  const handleSearchPatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const foundPatient = await api.getUserByCpf(cpfSearch); 
      
      if (foundPatient && foundPatient.role === 'patient') {
        setPatient(foundPatient);
      } else {
        setError('Paciente não encontrado ou CPF inválido.');
        setPatient(null);
      }
    } catch (err) {
      setError('Erro ao buscar paciente. Verifique o CPF.');
      setPatient(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmApplication = async () => {
    setLoading(true);
    setError(null);
    try {
       const selectedLot = lots.find(l => l.id === selectedLotId);
      
      if (!selectedLot) {
          setError('Selecione um lote válido.');
          setLoading(false);
          return;
      }

      // Payload para criar o registro
      const payload = {
        patient_id: patient.id,
        vaccine_lot_id: selectedLot.id, // ou vacina_id e lote, depende do seu backend
        application_date: new Date().toISOString()
      };

      await api.registerVaccination(payload);
      
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao registrar aplicação.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderStepContent = () => {
    if (success) {
      return (
        <div className="success-animation">
          <div className="success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <h2>Aplicação Registrada!</h2>
          <p>A vacina foi registrada com sucesso no histórico do paciente.</p>
          <div className="step-actions" style={{justifyContent: 'center'}}>
             <button className="action-button primary-button" onClick={onBack}>Voltar ao Dashboard</button>
             <button className="action-button secondary-button" onClick={() => window.location.reload()}>Nova Aplicação</button>
          </div>
        </div>
      );
    }

    switch (step) {
      case 1: // Buscar Paciente
        return (
          <>
            <h2 className="section-title" style={{textAlign: 'center'}}>Identificar Paciente</h2>
            <p className="section-subtitle" style={{textAlign: 'center', marginBottom: '2rem'}}>Digite o CPF do paciente para iniciar</p>
            
            <form onSubmit={handleSearchPatient}>
              <div className="form-group">
                <label>CPF do Paciente</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="000.000.000-00"
                  value={cpfSearch}
                  onChange={(e) => setCpfSearch(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="action-button secondary-button" disabled={loading}>
                {loading ? 'Buscando...' : 'Buscar Paciente'}
              </button>
            </form>

            {patient && (
              <div className="patient-found-card" style={{marginTop: '1.5rem'}}>
                <h4 style={{margin: '0 0 0.5rem 0', color: '#2a2a2a'}}>{patient.name}</h4>
                <p style={{margin: 0, fontSize: '0.9rem', color: '#666'}}>
                  Cartão SUS: {patient.sus_card_number} <br/>
                  Nascimento: {new Date(patient.birth_date).toLocaleDateString()}
                </p>
                <button 
                  className="action-button primary-button" 
                  style={{marginTop: '1rem'}}
                  onClick={nextStep}
                >
                  Confirmar Paciente e Avançar
                </button>
              </div>
            )}
          </>
        );

      case 2: // Selecionar Vacina/Lote
        return (
          <>
            <h2 className="section-title" style={{textAlign: 'center'}}>Dados da Vacina</h2>
            <p className="section-subtitle" style={{textAlign: 'center', marginBottom: '2rem'}}>Selecione o lote a ser aplicado</p>

            <div className="form-group">
              <label>Selecione a Vacina / Lote Disponível</label>
              <select 
                className="form-select"
                value={selectedLotId}
                onChange={(e) => setSelectedLotId(e.target.value)}
              >
                <option value="">Selecione...</option>
                {lots.map(lot => (
                  <option key={lot.id} value={lot.id}>
                    {lot.vaccine?.name} - Lote: {lot.lot_number} (Val: {new Date(lot.expiry_date).toLocaleDateString()})
                  </option>
                ))}
              </select>
              {lots.length === 0 && <p style={{color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.5rem'}}>Nenhum lote disponível encontrado.</p>}
            </div>

            <div className="step-actions">
              <button className="action-button secondary-button" onClick={prevStep}>Voltar</button>
              <button 
                className="action-button primary-button" 
                onClick={nextStep}
                disabled={!selectedLotId}
              >
                Revisar e Aplicar
              </button>
            </div>
          </>
        );

      case 3: // Confirmação
        const lotInfo = lots.find(l => l.id === parseInt(selectedLotId));
        return (
          <>
             <h2 className="section-title" style={{textAlign: 'center'}}>Confirmar Aplicação</h2>
             <p className="section-subtitle" style={{textAlign: 'center', marginBottom: '2rem'}}>Revise os dados antes de finalizar</p>

             <div className="summary-list">
               <div className="summary-item">
                 <span>Paciente</span>
                 <strong>{patient.name}</strong>
               </div>
               <div className="summary-item">
                 <span>Vacina</span>
                 <strong>{lotInfo?.vaccine?.name}</strong>
               </div>
               <div className="summary-item">
                 <span>Fabricante</span>
                 <strong>{lotInfo?.vaccine?.manufacturer}</strong>
               </div>
               <div className="summary-item">
                 <span>Lote</span>
                 <strong>{lotInfo?.lot_number}</strong>
               </div>
               <div className="summary-item">
                 <span>Data Aplicação</span>
                 <strong>{new Date().toLocaleDateString()}</strong>
               </div>
             </div>

             <div className="step-actions">
              <button className="action-button secondary-button" onClick={prevStep} disabled={loading}>Voltar</button>
              <button 
                className="action-button primary-button" 
                onClick={handleConfirmApplication}
                disabled={loading}
                style={{backgroundColor: '#4CAF50'}}
              >
                {loading ? 'Registrando...' : 'Confirmar Aplicação'}
              </button>
            </div>
          </>
        );
      default: return null;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
           <p className="breadcrumb">Dashboard → Aplicar Vacina</p>
           <div className="logo-section">
             <button className="logout-button" onClick={onBack} style={{padding: '0.5rem', border: 'none'}}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
               </svg>
            </button>
             <h2 className="logo-title">Nova Aplicação</h2>
           </div>
        </div>
      </div>

      <div className="dashboard-content">
        {!success && (
          <div className="wizard-progress">
            <div className={`step-indicator ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="step-number">1</div>
              <span>Paciente</span>
            </div>
            <div className={`step-indicator ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="step-number">2</div>
              <span>Vacina</span>
            </div>
            <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span>Confirmar</span>
            </div>
          </div>
        )}

        <div className="wizard-card">
          {error && (
             <div className="error-banner" style={{marginBottom: '1rem'}}>
               <p>{error}</p>
             </div>
          )}
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}

export default AplicarVacina;