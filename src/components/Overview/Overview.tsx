import React from 'react';
import './Overview.css';

const Overview: React.FC = () => {
  return (
    <div className="card overview">
      <div className="overview-header">
        <h2>Início</h2>
        <span>&#x1F50D;</span> {/* Search Icon */}
      </div>
      <div className="overview-grid">
        <div className="info-box" style={{backgroundColor: '#E8F5E9'}}>
          <div className="info-box-icon"></div>
          <div className="info-box-content">
            <span className="info-box-number">50</span>
            <span className="info-box-text">Animais</span>
          </div>
        </div>
        <div className="info-box" style={{backgroundColor: '#E8F5E9'}}>
          <div className="info-box-icon"></div>
          <div className="info-box-content">
            <span className="info-box-number">250kg</span>
            <span className="info-box-text">Estoque</span>
          </div>
        </div>
        <div className="info-box" style={{backgroundColor: '#FFFDE7'}}>
          <div className="info-box-icon"></div>
          <div className="info-box-content">
            <span className="info-box-number">R$ 200</span>
            <span className="info-box-text">Custos</span>
          </div>
        </div>
        <div className="info-box" style={{backgroundColor: '#F3E5F5'}}>
          <div className="info-box-icon"></div>
          <div className="info-box-content">
            <span className="info-box-number">2</span>
            <span className="info-box-text">Eventos</span>
          </div>
        </div>
      </div>
      <div className="overview-chart">
        <p>Próxima ação</p>
        {/* Placeholder for chart */}
        <div className="chart-placeholder">Chart will be here</div>
      </div>
    </div>
  );
};

export default Overview;
