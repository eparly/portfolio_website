import React from 'react';
import './Header.css';
import { useAuth } from 'react-oidc-context';

const Header: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
  const auth = useAuth();

  const handleLogin = async () => {
    if (!auth || !auth.signinRedirect) {
      console.error('Auth object is not properly configured.');
      return;
    }
    try {
      await auth.signinRedirect(); // Use signinRedirect safely
      console.log('Login successful');
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title">Parliament & Romano Recipes</h1>
        <nav className="header-nav">
          <a href="/" className="header-link">Home</a>
          {!isAuthenticated && (<button onClick={handleLogin} className="login-button">Login</button>)}
          {isAuthenticated && (
            <a href="/add-recipe" className="header-link">Add Recipe</a>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;