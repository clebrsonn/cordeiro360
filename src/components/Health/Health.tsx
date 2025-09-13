import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Health.css';
import '../Overview/Overview.css'; // Reusing card styles

// --- Interfaces ---
interface HealthRecord {
  id: number;
  animal_id: number;
  date: string;
  status: string;
  medications: string;
  observations: string;
  animal_name: string;
  tag_number: string;
}

// --- Component ---
const Health: React.FC = () => {
  // --- State ---
  const [recentRecords, setRecentRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  // --- Data Fetching ---
  const fetchRecentHealthRecords = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      // Fetch all records and slice the 5 most recent ones
      const response = await axios.get('/api/health-records', { headers });
      setRecentRecords(response.data.slice(0, 5));
    } catch (err) {
      setError('Failed to fetch health records.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRecentHealthRecords();
  }, [fetchRecentHealthRecords]);

  // --- Helper Functions ---
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  // --- Render ---
  return (
    <div className="card health">
      <div className="card-header">
        <h2 className="health-title">Sanidade e Manejo</h2>
        <div className="health-icon">🩺</div>
      </div>
      <p className="health-description">
        Últimos 5 registros de saúde. Para gerenciar, acesse a área de administração.
      </p>
      <div className="health-records-list">
        {loading && <p>Carregando registros...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && recentRecords.length === 0 && !error && (
          <p>Nenhum registro de saúde encontrado.</p>
        )}
        <ul>
          {recentRecords.map(record => (
            <li key={record.id} className="health-record-item">
              <div className="record-details">
                <span className="record-animal">
                  {record.animal_name || `Animal #${record.tag_number}`}
                </span>
                <span className="record-status">{record.status}</span>
              </div>
              <span className="record-date">{formatDate(record.date)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Health;
