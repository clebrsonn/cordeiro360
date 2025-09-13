import React from 'react';
import '../Overview/Overview.css'; // Reusing card styles
import './Health.css';

const Health: React.FC = () => {
  return (
    <div className="card health">
      <h2 className="health-title">Sanidade e Manejo</h2>
      <p className="health-description">
        Acesse a área de administração para gerenciar a lista de animais e registrar todos os eventos de saúde, como vacinas, tratamentos e observações importantes.
      </p>
      <div className="health-icon-large">🩺</div>
    </div>
  );
};

export default Health;
