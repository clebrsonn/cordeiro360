import React from 'react';
import '../Overview/Overview.css'; // Reusing card styles
import './Health.css';

const Health: React.FC = () => {
  return (
    <div className="card health">
      <h2 className="health-title">Sanidade</h2>
      <ul className="health-list">
        <li className="health-item">
          <span className="health-icon">💉</span>
          <span>Vacinar cordeiros</span>
          <span className="arrow-icon">&gt;</span>
        </li>
        <li className="health-item">
          <span className="health-icon">💊</span>
          <span>Vermifugar o rebanho</span>
          <span className="arrow-icon">&gt;</span>
        </li>
        <li className="health-item">
          <span className="health-icon">🔍</span>
          <span>Coletar fezes</span>
          <span className="arrow-icon">&gt;</span>
        </li>
      </ul>
      <div className="health-buttons">
        <button className="health-button green">Doricor</button>
        <button className="health-button white">Libraty</button>
      </div>
    </div>
  );
};

export default Health;
