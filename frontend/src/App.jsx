import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import Requisitions from './pages/Requisitions';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Demo from './pages/Demo';
import Profile from './pages/Profile';


import NotFound from './pages/NotFound';

function App() {
  // User information
  const currentDateTime = "2025-04-24 19:06:02";
  const currentUser = "neupane-rajan";
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');

  // Check if already logged in from storage on component mount
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('isLoggedIn') === 'true';
    const localAuth = localStorage.getItem('isLoggedIn') === 'true';
    
    if (sessionAuth || localAuth) {
      setIsAuthenticated(true);
      const storedRole = sessionStorage.getItem('userRole') || localStorage.getItem('userRole') || 'admin';
      setUserRole(storedRole);
    }
  }, []);

  const handleLogin = (email, password, role) => {
    // Store authentication data
    const authRole = role || 'admin'; // Default to admin if no role provided
    
    // Save to session storage (or localStorage if "remember me" is checked)
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('username', currentUser);
    sessionStorage.setItem('loginTime', currentDateTime);
    sessionStorage.setItem('userRole', authRole);
    
    // Update state
    setIsAuthenticated(true);
    setUserRole(authRole);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
        } />
        <Route path="/demo" element={<Demo />} />
        <Route path="/" element={<Navigate to="/demo" />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<Layout currentUser={currentUser} currentDateTime={currentDateTime} />}>
            <Route path="/dashboard" element={<Dashboard userRole={userRole} />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/requisitions" element={<Requisitions />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
            {/* Catch all other routes */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
