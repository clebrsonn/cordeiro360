import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../Modal/Modal';
import '../Overview/Overview.css';
import './Cuts.css';

interface Cut {
  id: number;
  name: string;
  description: string;
  nutritional_value: string;
}

const Cuts: React.FC = () => {
  const [cuts, setCuts] = useState<Cut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCut, setSelectedCut] = useState<Cut | null>(null);

  useEffect(() => {
    const fetchCuts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/cuts');
        setCuts(response.data);
      } catch (err) {
        setError('Failed to fetch cuts data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCuts();
  }, []);

  const handleCutClick = (cut: Cut) => {
    setSelectedCut(cut);
  };

  const handleCloseModal = () => {
    setSelectedCut(null);
  };

  return (
    <>
      <div className="card cuts">
        <h2 className="cuts-title">Cortes & Valor agregado</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && (
          <ul className="cuts-list">
            {cuts.length > 0 ? (
              cuts.map((cut) => (
                <li key={cut.id} className="cuts-item" onClick={() => handleCutClick(cut)}>
                  <span className="cut-icon">🥩</span>
                  <span>{cut.name}</span>
                </li>
              ))
            ) : (
              <p>No cuts found.</p>
            )}
          </ul>
        )}
      </div>

      <Modal isOpen={!!selectedCut} onClose={handleCloseModal}>
        {selectedCut && (
          <div className="cut-details">
            <h3>{selectedCut.name}</h3>
            <p><strong>Descrição:</strong> {selectedCut.description || 'N/A'}</p>
            <p><strong>Valores Nutricionais:</strong> {selectedCut.nutritional_value || 'N/A'}</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Cuts;
