import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './CutsManagementPage.css';

interface Cut {
  id: number;
  name: string;
  description: string;
  nutritional_value: string;
}

const CutsManagementPage: React.FC = () => {
  const [cuts, setCuts] = useState<Cut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCut, setEditingCut] = useState<Cut | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', nutritional_value: '' });
  const { token } = useAuth(); // Needed for authenticated requests
  const navigate = useNavigate();

  const fetchCuts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/cuts');
      setCuts(response.data);
    } catch (err) {
      setError('Falha ao buscar cortes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCuts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (editingCut) {
        // Update existing cut
        await axios.put(`/api/cuts/${editingCut.id}`, formData, { headers });
      } else {
        // Add new cut
        await axios.post('/api/cuts', formData, { headers });
      }
      resetForm();
      fetchCuts(); // Refresh list
    } catch (err) {
      setError('Falha ao salvar corte. Por favor, tente novamente.');
    }
  };

  const handleEditClick = (cut: Cut) => {
    setEditingCut(cut);
    setFormData({ name: cut.name, description: cut.description, nutritional_value: cut.nutritional_value });
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este corte?')) {
      try {
        await axios.delete(`/api/cuts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchCuts(); // Refresh list
      } catch (err) {
        setError('Falha ao excluir corte.');
      }
    }
  };

  const resetForm = () => {
    setEditingCut(null);
    setFormData({ name: '', description: '', nutritional_value: '' });
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <button onClick={() => navigate('/')} className="back-button">← Voltar</button>
        <h1>Gerenciar Cortes</h1>
      </header>
      <div className="admin-content">
        <div className="form-container">
          <h3>{editingCut ? 'Editar Corte' : 'Adicionar Novo Corte'}</h3>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label>Nome</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange}></textarea>
            </div>
            <div className="form-group">
              <label>Valor Nutricional</label>
              <input type="text" name="nutritional_value" value={formData.nutritional_value} onChange={handleInputChange} />
            </div>
            <div className="form-actions">
              <button type="submit">{editingCut ? 'Atualizar Corte' : 'Adicionar Corte'}</button>
              {editingCut && <button type="button" onClick={resetForm}>Cancelar</button>}
            </div>
          </form>
        </div>

        <div className="list-container">
          <h2>Lista de Cortes</h2>
          {loading && <p>Carregando cortes...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {cuts.map((cut) => (
                  <tr key={cut.id}>
                    <td>{cut.name}</td>
                    <td>{cut.description}</td>
                    <td className="actions">
                      <button className="edit-btn" onClick={() => handleEditClick(cut)}>Editar</button>
                      <button className="delete-btn" onClick={() => handleDeleteClick(cut.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CutsManagementPage;
