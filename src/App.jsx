import React, { useState, useContext } from 'react';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import { AuthContext } from './context/AuthProvider';
import { authAPI } from './services/api';

const App = () => {
  const [showLogin, setShowLogin] = useState(true);
  const { user, login, logout, isAdmin } = useContext(AuthContext);

  const handleLogin = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    if (data.success) {
      login(data.user, data.user.token);
    } else {
      throw new Error(data.message || 'Login failed');
    }
  };

  const handleSignup = async (userData) => {
    const { data } = await authAPI.signup(userData);
    if (data.success) {
      // Auto login after signup
      login(data.user, data.user.token);
    } else {
      throw new Error(data.message || 'Signup failed');
    }
  };

  const handleToggle = () => {
    setShowLogin(!showLogin);
  };

  // Show auth screens if not logged in
  if (!user) {
    return (
      <>
        {showLogin ? (
          <Login onLogin={handleLogin} onToggleSignup={handleToggle} />
        ) : (
          <Signup onSignup={handleSignup} onToggleLogin={handleToggle} />
        )}
      </>
    );
  }

  // Show appropriate dashboard based on role
  return (
    <>
      {isAdmin ? (
        <AdminDashboard onLogout={logout} />
      ) : (
        <EmployeeDashboard onLogout={logout} />
      )}
    </>
  );
};

export default App;