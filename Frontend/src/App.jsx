import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import DashboardPaciente from './components/DashboardPaciente';
import DashboardProfissional from './components/DashboardProfissional';
import { getUserRole } from './utils/jwt';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const role = getUserRole(token);
      if (role) {
        setUserRole(role);
        setUserToken(token);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLoginSuccess = (token) => {
    const role = getUserRole(token);
    setUserRole(role);
    setUserToken(token);
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = (token) => {
    const role = getUserRole(token);
    setUserRole(role);
    setUserToken(token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserToken(null);
    setCurrentView('login');
  };

  const switchToRegister = () => {
    setCurrentView('register');
  };

  const switchToLogin = () => {
    setCurrentView('login');
  };

  if (isAuthenticated && userRole) {
    if (userRole === 'patient') {
      return <DashboardPaciente userToken={userToken} onLogout={handleLogout} />;
    } else if (userRole === 'health_professional') {
      return <DashboardProfissional userToken={userToken} onLogout={handleLogout} />;
    }
  }

  return (
    <div className="app-container">
      {currentView === 'login' ? (
        <Login 
          onSwitchToRegister={switchToRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <Register 
          onSwitchToLogin={switchToLogin}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
    </div>
  );
}

export default App;
