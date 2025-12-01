import { useState } from 'react';
import { DataProvider } from './context/DataContext';
import MenuPrincipal from './components/Layout/MenuPrincipal';
import HomePage from './components/Home/HomePage';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'admin'
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const handleLogin = (role) => {
    if (role === 'admin') {
      setCurrentView('admin');
      setIsUserLoggedIn(true); // Admin is also a user
    } else {
      setIsUserLoggedIn(true);
      // alert("Login de usuario simulado. Bienvenido!"); // Removed to avoid confusion
    }
  };

  const handleLogout = () => {
    setCurrentView('home');
    setIsUserLoggedIn(false);
  };

  return (
    <DataProvider>
      <div className="App">
        {currentView === 'admin' ? (
          <MenuPrincipal onLogout={handleLogout} />
        ) : (
          <HomePage onLogin={handleLogin} isUserLoggedIn={isUserLoggedIn} />
        )}
      </div>
    </DataProvider>
  );
}

export default App;
