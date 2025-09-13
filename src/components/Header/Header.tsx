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
            <Link to="/admin/cuts" className="nav-link">Manage Cuts</Link>
            <Link to="/admin/library" className="nav-link">Manage Library</Link>
            <Link to="/admin/animals" className="nav-link">Manage Animals</Link>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <Link to="/login" className="nav-link">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
