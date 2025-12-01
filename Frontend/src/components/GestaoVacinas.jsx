import { useState, useEffect } from "react";
import api from "../services/api";
import "./TableLayout.css";

function GestaoVacinas({ onBack }) {
  const [vaccines, setVaccines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    manufacturer: "",
    doses: "",
    interval: "",
  });

  useEffect(() => {
    loadVaccines();
  }, []);

  const loadVaccines = async () => {
    try {
      const data = await api.getVaccines();
      setVaccines(data || []);
    } catch (error) {
      console.error("Erro ao carregar vacinas", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta vacina?")) {
      try {
        await api.deleteVaccine(id);
        loadVaccines();
      } catch (error) {
        alert(error.message || "Erro ao excluir");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Criar o payload mapeando para os nomes que o Banco de Dados exige
      const payload = {
        name: formData.name,
        manufacturer: formData.manufacturer,
        // CORREÇÃO 1: Mapear 'doses' do form para 'dose_info' do banco
        dose_info: parseInt(formData.doses, 10), 
        // CORREÇÃO 2: Garantir que é número
        interval: parseInt(formData.interval, 10) 
      };

      console.log('Enviando:', payload); // Para debug

      // CORREÇÃO 3: Enviar 'payload' (que tratamos acima), e NÃO 'formData'
      await api.createVaccine(payload);
      
      setShowModal(false);
      setFormData({ name: '', manufacturer: '', doses: '', interval: '' });
      loadVaccines();
    } catch (error) {
      console.error(error);
      // Mostra mensagem mais detalhada se vier do backend
      alert(error.message || 'Erro ao criar vacina'); 
    }
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <div className="management-title">
          <h2>Tipos de vacinas</h2>
          <p>Gerencie o catálogo de vacinas disponíveis</p>
        </div>
        <div>
          <button
            className="action-button secondary-button"
            onClick={onBack}
            style={{ marginRight: "10px" }}
          >
            Voltar
          </button>
          <button className="btn-new" onClick={() => setShowModal(true)}>
            + Novo tipo
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Fabricante</th>
              <th>Doses</th>
              <th>Intervalo (dias)</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vaccines.map((vac) => (
              <tr key={vac.id}>
                <td>{vac.name}</td>
                <td>{vac.manufacturer}</td>
                <td>{vac.doses}</td>
                <td>{vac.interval}</td>
                <td>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(vac.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Cadastrar nova vacina</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <label>Nome</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Covid-19"
                />
              </div>
              <div className="form-row">
                <label>Fabricante</label>
                <input
                  required
                  value={formData.manufacturer}
                  onChange={(e) =>
                    setFormData({ ...formData, manufacturer: e.target.value })
                  }
                  placeholder="Ex: Pfizer"
                />
              </div>
              <div className="form-row">
                <label>Doses Necessárias</label>
                <input
                  type="number"
                  required
                  value={formData.doses}
                  onChange={(e) =>
                    setFormData({ ...formData, doses: e.target.value })
                  }
                />
              </div>
              <div className="form-row">
                <label>Intervalo (dias)</label>
                <input
                  type="number"
                  value={formData.interval}
                  onChange={(e) =>
                    setFormData({ ...formData, interval: e.target.value })
                  }
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="action-button secondary-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="action-button primary-button">
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestaoVacinas;
