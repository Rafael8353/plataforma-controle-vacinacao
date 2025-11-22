import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (token) => {
    setIsAuthenticated(true);
    console.log('Login realizado com sucesso!', token);
  };

  const handleRegisterSuccess = (token) => {
    setIsAuthenticated(true);
    console.log('Cadastro realizado com sucesso!', token);
  };

  const switchToRegister = () => {
    setCurrentView('register');
  };

  const switchToLogin = () => {
    setCurrentView('login');
  };

  if (isAuthenticated) {
    return (
      <div className="app-container">
        <div className="dashboard">
          <h1>Bem-vindo ao VacinaCard!</h1>
          <p>Você está autenticado.</p>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              setIsAuthenticated(false);
            }}
            className="logout-button"
          >
            Sair
          </button>
        </div>
      </div>
    );
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
