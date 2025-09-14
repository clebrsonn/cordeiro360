import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Overview.css';

interface OverviewStats {
  animalCount: number;
  eventCount: number;
  totalCosts: number | null;
  stockQuantity: number | null;
}

const Overview: React.FC = () => {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchStats = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('/api/overview', { headers });
      setStats(response.data);
    } catch (err) {
      setError('Falha ao carregar dados do painel.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="card overview">
      <div className="overview-header">
        <h2>Início</h2>
        <span>&#x1F4CA;</span> {/* Bar Chart Icon */}
      </div>
      <div className="overview-grid">
        <div className="info-box" style={{backgroundColor: '#E8F5E9'}}>
          <div className="info-box-icon">🐑</div>
          <div className="info-box-content">
            <span className="info-box-number">{loading ? '...' : stats?.animalCount ?? 0}</span>
            <span className="info-box-text">Animais</span>
          </div>
        </div>
        <div className="info-box" style={{backgroundColor: '#E3F2FD'}}>
          <div className="info-box-icon">📦</div>
          <div className="info-box-content">
            <span className="info-box-number">{loading ? '...' : `${stats?.stockQuantity ?? 0} un`}</span>
            <span className="info-box-text">Estoque Total</span>
          </div>
        </div>
        <div className="info-box" style={{backgroundColor: '#FFFDE7'}}>
          <div className="info-box-icon">💰</div>
          <div className="info-box-content">
            <span className="info-box-number">{loading ? '...' : formatCurrency(stats?.totalCosts)}</span>
            <span className="info-box-text">Custos de Compra</span>
          </div>
        </div>
        <div className="info-box" style={{backgroundColor: '#F3E5F5'}}>
          <div className="info-box-icon">🗓️</div>
          <div className="info-box-content">
            <span className="info-box-number">{loading ? '...' : stats?.eventCount ?? 0}</span>
            <span className="info-box-text">Eventos de Saúde</span>
          </div>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="overview-chart">
        <p>Atividade Recente</p>
        <div className="chart-placeholder">Gráfico de atividades futuras.</div>
      </div>
    </div>
  );
};

export default Overview;
