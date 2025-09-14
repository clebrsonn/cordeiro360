import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password,
      });

      if (response.data.token) {
        login(response.data.token);
        navigate('/'); // Redirect to dashboard
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        // Assuming server sends Portuguese errors for "Invalid credentials"
        setError(err.response.data.message);
      } else {
        setError('Falha no login. Por favor, tente novamente.');
      }
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Entrar</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="username">Usuário</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Entrar</button>
        <p className="register-link">
          Não tem uma conta? <Link to="/register">Registre-se aqui</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
