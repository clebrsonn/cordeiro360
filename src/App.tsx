import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import CutsManagementPage from './pages/Admin/CutsManagementPage';
import LibraryManagementPage from './pages/Admin/LibraryManagementPage';
import AnimalManagementPage from './pages/Admin/AnimalManagementPage';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cuts"
            element={
              <ProtectedRoute>
                <CutsManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/library"
            element={
              <ProtectedRoute>
                <LibraryManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/animals"
            element={
              <ProtectedRoute>
                <AnimalManagementPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
