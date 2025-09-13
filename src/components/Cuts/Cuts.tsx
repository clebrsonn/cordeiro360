import React from 'react';
import '../Overview/Overview.css'; // Reusing card styles
import './Cuts.css';

const Cuts: React.FC = () => {
  return (
    <div className="card cuts">
      <h2 className="cuts-title">Cortes & Valor agregado</h2>
      <ul className="cuts-list">
        <li className="cuts-item">
          <span className="cut-icon">🥩</span>
          <span>Carré francês</span>
        </li>
        <li className="cuts-item">
          <span className="cut-icon">🥩</span>
          <span>Pernil</span>
        </li>
        <li className="cuts-item">
          <span className="cut-icon">🥩</span>
          <span>Paleta</span>
        </li>
        <li className="cuts-item">
          <span className="cut-icon">🥩</span>
          <span>Costela</span>
        </li>
        <li className="cuts-item">
          <span className="cut-icon">🥩</span>
          <span>Miúdos</span>
        </li>
      </ul>
    </div>
  );
};

export default Cuts;
