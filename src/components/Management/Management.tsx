import React from 'react';
import '../Overview/Overview.css'; // Reusing card styles
import './Management.css';

const Management: React.FC = () => {
  return (
    <div className="card management">
      <h2 className="management-title">Gestão</h2>
      <ul className="management-list">
        <li className="management-item">Animal registrado</li>
        <li className="management-item">Estoque de ração</li>
        <li className="management-item">
          <span>Despesas</span>
          <span className="plus-icon">+</span>
        </li>
      </ul>
      <div className="chart-container">
        <div className="donut-chart"></div>
      </div>
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color" style={{backgroundColor: '#FFCA28'}}></span>
          <span>Custos</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{backgroundColor: '#66BB6A'}}></span>
          <span>Receita</span>
        </div>
      </div>
    </div>
  );
};

export default Management;
