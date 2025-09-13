import React, { useState, useEffect } from 'react';
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

  const fetchCuts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/cuts');
      setCuts(response.data);
    } catch (err) {
      setError('Failed to fetch cuts.');
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
        await axios.put(`http://localhost:3001/api/cuts/${editingCut.id}`, formData, { headers });
      } else {
        // Add new cut
        await axios.post('http://localhost:3001/api/cuts', formData, { headers });
      }
      resetForm();
      fetchCuts(); // Refresh list
    } catch (err) {
      setError('Failed to save cut. Please try again.');
    }
  };

  const handleEditClick = (cut: Cut) => {
    setEditingCut(cut);
    setFormData({ name: cut.name, description: cut.description, nutritional_value: cut.nutritional_value });
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this cut?')) {
      try {
        await axios.delete(`http://localhost:3001/api/cuts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchCuts(); // Refresh list
      } catch (err) {
        setError('Failed to delete cut.');
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
        <h1>Manage Cuts</h1>
      </header>
      <div className="admin-content">
        <div className="form-container">
          <h3>{editingCut ? 'Edit Cut' : 'Add a New Cut'}</h3>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange}></textarea>
            </div>
            <div className="form-group">
              <label>Nutritional Value</label>
              <input type="text" name="nutritional_value" value={formData.nutritional_value} onChange={handleInputChange} />
            </div>
            <div className="form-actions">
              <button type="submit">{editingCut ? 'Update Cut' : 'Add Cut'}</button>
              {editingCut && <button type="button" onClick={resetForm}>Cancel</button>}
            </div>
          </form>
        </div>

        <div className="list-container">
          <h2>Cuts List</h2>
          {loading && <p>Loading cuts...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cuts.map((cut) => (
                  <tr key={cut.id}>
                    <td>{cut.name}</td>
                    <td>{cut.description}</td>
                    <td className="actions">
                      <button className="edit-btn" onClick={() => handleEditClick(cut)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDeleteClick(cut.id)}>Delete</button>
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
