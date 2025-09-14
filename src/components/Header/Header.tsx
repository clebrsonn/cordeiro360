import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-branding">
        <Link to="/">
          <h1>CORDEIRO 360</h1>
          <p>FORÇA E VALOR NO CAMPO</p>
        </Link>
      </div>
      <nav className="header-nav">
        {isAuthenticated ? (
          <>
            <Link to="/admin/animals" className="nav-link">Animais e Saúde</Link>
            <Link to="/admin/cuts" className="nav-link">Cortes</Link>
            <Link to="/admin/stock" className="nav-link">Estoque</Link>
            <Link to="/admin/library" className="nav-link">Biblioteca</Link>
            <button onClick={handleLogout} className="logout-button">Sair</button>
          </>
        ) : (
          <Link to="/login" className="nav-link">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
