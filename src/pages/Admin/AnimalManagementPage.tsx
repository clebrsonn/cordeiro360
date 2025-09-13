import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './CutsManagementPage.css'; // Reusing styles

// --- Interfaces ---
interface Animal {
  id: number;
  name: string;
  tag_number: string;
  species: string;
}
interface HealthRecord {
  id: number;
  animal_id: number;
  date: string;
  status: string;
  medications: string;
  observations: string;
}
const emptyHealthRecord = { id: 0, animal_id: 0, date: '', status: '', medications: '', observations: ''};

// --- Component ---
const AnimalManagementPage: React.FC = () => {
  // --- State ---
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [animalFormData, setAnimalFormData] = useState({ name: '', tag_number: '', species: '' });

  const [editingHealthRecord, setEditingHealthRecord] = useState<HealthRecord | null>(null);
  const [healthFormData, setHealthFormData] = useState(emptyHealthRecord);

  const { token } = useAuth();
  const navigate = useNavigate();


  // --- Data Fetching ---
  const fetchAnimals = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('/api/animals', { headers });
      setAnimals(response.data);
    } catch (err) {
      setError('Failed to fetch animals.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  const fetchHealthRecords = async (animalId: number) => {
    try {
        const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`/api/health-records/animal/${animalId}`, { headers });
      setHealthRecords(response.data);
    } catch (err) {
      setError('Failed to fetch health records.');
    }
  };

  // --- Animal CRUD Handlers ---
  const handleAnimalFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnimalFormData({ ...animalFormData, [e.target.name]: e.target.value });
  };

  const handleAnimalFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingAnimal ? 'put' : 'post';
    const url = editingAnimal ? `/api/animals/${editingAnimal.id}` : '/api/animals';
    try {
        const headers = { Authorization: `Bearer ${token}` };
      await axios[method](url, animalFormData, { headers });
      resetAnimalForm();
      fetchAnimals();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save animal.');
    }
  };

  const handleEditAnimalClick = (animal: Animal) => {
    setEditingAnimal(animal);
    setAnimalFormData({ name: animal.name, tag_number: animal.tag_number, species: animal.species });
  };

  const handleDeleteAnimalClick = async (id: number) => {
    if (window.confirm('Are you sure? This also deletes all associated health records.')) {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        await axios.delete(`/api/animals/${id}`, { headers });
        fetchAnimals();
        if (selectedAnimal?.id === id) setSelectedAnimal(null); // Clear selection if deleted
      } catch (err) {
        setError('Failed to delete animal.');
      }
    }
  };

  const resetAnimalForm = () => {
    setEditingAnimal(null);
    setAnimalFormData({ name: '', tag_number: '', species: '' });
  };

  // --- Health Record CRUD Handlers ---
  const handleViewHealthClick = (animal: Animal) => {
    setSelectedAnimal(animal);
    fetchHealthRecords(animal.id);
  };

  const handleHealthFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHealthFormData({ ...healthFormData, [e.target.name]: e.target.value });
  };

  const handleHealthFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnimal) return;
    const method = editingHealthRecord ? 'put' : 'post';
    const url = editingHealthRecord ? `/api/health-records/${editingHealthRecord.id}` : `/api/health-records/${selectedAnimal.id}`;
    try {
        const headers = { Authorization: `Bearer ${token}` };
      await axios[method](url, healthFormData, { headers });
      resetHealthForm();
      fetchHealthRecords(selectedAnimal.id);
    } catch (err) {
      setError('Failed to save health record.');
    }
  };

  const handleEditHealthClick = (record: HealthRecord) => {
    setEditingHealthRecord(record);
    setHealthFormData(record);
  };

  const handleDeleteHealthClick = async (recordId: number) => {
    if (window.confirm('Are you sure you want to delete this health record?')) {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        await axios.delete(`/api/health-records/${recordId}`, { headers });
        if(selectedAnimal) fetchHealthRecords(selectedAnimal.id);
      } catch (err) {
        setError('Failed to delete health record.');
      }
    }
  };

  const resetHealthForm = () => {
    setEditingHealthRecord(null);
    setHealthFormData(emptyHealthRecord);
  };

  // --- Render ---
  return (
    <div className="admin-page">
      <header className="admin-header">
        <button onClick={() => navigate('/')} className="back-button">← Voltar</button>
        <h1>Gerenciar Animais e Saúde</h1>
      </header>
      <div className="admin-content">
        <div className="form-container">
          <h3>{editingAnimal ? 'Edit Animal' : 'Add New Animal'}</h3>
          <form onSubmit={handleAnimalFormSubmit}>
            <div className="form-group"><label>Name</label><input type="text" name="name" value={animalFormData.name} onChange={handleAnimalFormChange} /></div>
            <div className="form-group"><label>Tag Number</label><input type="text" name="tag_number" value={animalFormData.tag_number} onChange={handleAnimalFormChange} required /></div>
            <div className="form-group"><label>Species</label><input type="text" name="species" value={animalFormData.species} onChange={handleAnimalFormChange} /></div>
            <div className="form-actions">
              <button type="submit">{editingAnimal ? 'Update Animal' : 'Add Animal'}</button>
              {editingAnimal && <button type="button" onClick={resetAnimalForm}>Cancel</button>}
            </div>
          </form>
        </div>

        <div className="list-container">
          <h2>Animal List</h2>
          {loading && <p>Loading animals...</p>}
          {error && <p className="error-message">{error}</p>}
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Tag Number</th><th>Species</th><th>Actions</th></tr></thead>
            <tbody>
              {animals.map((animal) => (
                <tr key={animal.id} className={selectedAnimal?.id === animal.id ? 'selected-row' : ''}>
                  <td>{animal.name}</td><td>{animal.tag_number}</td><td>{animal.species}</td>
                  <td className="actions">
                    <button className="edit-btn" onClick={() => handleEditAnimalClick(animal)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDeleteAnimalClick(animal.id)}>Delete</button>
                    <button className="view-health-btn" onClick={() => handleViewHealthClick(animal)}>Health</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedAnimal && (
          <div className="health-records-section">
            <h2>Health Records for {selectedAnimal.name} (#{selectedAnimal.tag_number})</h2>
            <div className="form-container">
              <h3>{editingHealthRecord ? 'Edit Health Record' : 'Add New Record'}</h3>
              <form onSubmit={handleHealthFormSubmit}>
                <div className="form-group"><label>Date</label><input type="date" name="date" value={healthFormData.date} onChange={handleHealthFormChange} required /></div>
                <div className="form-group"><label>Status</label><input type="text" name="status" value={healthFormData.status} onChange={handleHealthFormChange} /></div>
                <div className="form-group"><label>Medications</label><textarea name="medications" value={healthFormData.medications} onChange={handleHealthFormChange}></textarea></div>
                <div className="form-group"><label>Observations</label><textarea name="observations" value={healthFormData.observations} onChange={handleHealthFormChange}></textarea></div>
                <div className="form-actions">
                  <button type="submit">{editingHealthRecord ? 'Update Record' : 'Add Record'}</button>
                  {editingHealthRecord && <button type="button" onClick={resetHealthForm}>Cancel</button>}
                </div>
              </form>
            </div>
            <table className="admin-table">
              <thead><tr><th>Date</th><th>Status</th><th>Medications</th><th>Observations</th><th>Actions</th></tr></thead>
              <tbody>
                {healthRecords.map(record => (
                  <tr key={record.id}>
                    <td>{record.date}</td><td>{record.status}</td><td>{record.medications}</td><td>{record.observations}</td>
                    <td className="actions">
                      <button className="edit-btn" onClick={() => handleEditHealthClick(record)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDeleteHealthClick(record.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimalManagementPage;
