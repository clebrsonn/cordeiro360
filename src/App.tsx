import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout'; // Import the new layout
import CutsManagementPage from './pages/Admin/CutsManagementPage';
import LibraryManagementPage from './pages/Admin/LibraryManagementPage';
import AnimalManagementPage from './pages/Admin/AnimalManagementPage';
import StockManagementPage from './pages/Admin/StockManagementPage';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes that should not have the main layout */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes that will share the main layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* The Dashboard will be the index route of the layout */}
            <Route index element={<Dashboard />} />

            {/* All admin pages are nested here */}
            <Route path="admin/cuts" element={<CutsManagementPage />} />
            <Route path="admin/library" element={<LibraryManagementPage />} />
            <Route path="admin/animals" element={<AnimalManagementPage />} />
            <Route path="admin/stock" element={<StockManagementPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
