import React from 'react';
import '../Overview/Overview.css'; // Reusing card styles
import './Library.css';

const Library: React.FC = () => {
  return (
    <div className="card library">
      <h2 className="library-title">Biblioteca</h2>
      <ul className="library-list">
        <li className="library-item">
          <span className="library-icon"> L </span>
          <span>Cartilhas</span>
        </li>
        <li className="library-item">
          <span className="library-icon">▶</span>
          <span>Vídeos</span>
        </li>
        <li className="library-item">
          <span className="library-icon">✓</span>
          <span>Checklists</span>
        </li>
      </ul>
      <button className="library-button">Baixar materiais</button>
    </div>
  );
};

export default Library;
