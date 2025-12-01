import { useState, useEffect } from 'react';
import api from '../services/api';
import './TableLayout.css';

function GestaoEstoque({ onBack }) {
  const [lots, setLots] = useState([]);
  const [vaccines, setVaccines] = useState([]); // Para o Select do modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    vacina_id: '',
    numero_lote: '',
    quantidade_doses_inicial: '',
    data_validade: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [lotsData, vaccinesData] = await Promise.all([
        api.getVaccineLots(),
        api.getVaccines()
      ]);
      setLots(lotsData || []);
      setVaccines(vaccinesData || []);
    } catch (error) {
      console.error('Erro ao carregar dados', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Excluir este lote?')) {
      try {
        await api.deleteVaccineLot(id);
        loadData();
      } catch (error) {
        alert('Erro ao excluir lote');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createVaccineLot(formData);
      setShowModal(false);
      setFormData({ vacina_id: '', numero_lote: '', quantidade_doses_inicial: '', data_validade: '' });
      loadData();
    } catch (error) {
      alert(error.message || 'Erro ao criar lote');
    }
  };

  const getStatusValidade = (date) => {
    const today = new Date();
    const expiry = new Date(date);
    return expiry < today ? <span className="badge expired">Vencido</span> : <span className="badge valid">Válido</span>;
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <div className="management-title">
          <h2>Lotes de vacinas</h2>
          <p>Gerencie o estoque e validade dos lotes</p>
        </div>
        <div>
           <button className="action-button secondary-button" onClick={onBack} style={{marginRight: '10px'}}>Voltar</button>
           <button className="btn-new" onClick={() => setShowModal(true)}>+ Novo lote</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Vacina</th>
              <th>Número do Lote</th>
              <th>Qtd Atual</th>
              <th>Status Estoque</th>
              <th>Validade</th>
              <th>Status Validade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lots.map(lot => (
              <tr key={lot.id}>
                <td>{lot.vaccine?.name || 'Desconhecida'}</td>
                <td>{lot.lot_number}</td>
                <td>{lot.quantity_current}</td>
                <td>
                  {lot.quantity_current < 10 
                    ? <span className="badge low">Baixo</span> 
                    : <span className="badge ok">OK</span>}
                </td>
                <td>{new Date(lot.expiry_date).toLocaleDateString()}</td>
                <td>{getStatusValidade(lot.expiry_date)}</td>
                <td>
                  <button className="action-btn delete" onClick={() => handleDelete(lot.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Cadastrar novo lote</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <label>Vacina</label>
                <select 
                  required 
                  value={formData.vacina_id} 
                  onChange={e => setFormData({...formData, vacina_id: e.target.value})}
                >
                  <option value="">Selecione a vacina...</option>
                  {vaccines.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label>Número do Lote</label>
                <input required value={formData.numero_lote} onChange={e => setFormData({...formData, numero_lote: e.target.value})} />
              </div>
              <div className="form-row">
                <label>Quantidade Inicial</label>
                <input type="number" required value={formData.quantidade_doses_inicial} onChange={e => setFormData({...formData, quantidade_doses_inicial: e.target.value})} />
              </div>
              <div className="form-row">
                <label>Data de Validade</label>
                <input type="date" required value={formData.data_validade} onChange={e => setFormData({...formData, data_validade: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="action-button secondary-button" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="action-button primary-button">Cadastrar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestaoEstoque;