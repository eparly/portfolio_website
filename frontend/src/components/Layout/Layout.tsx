// src/components/Layout.tsx
import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import './Layout.css'; // Add shared styles here
import { useAuth } from 'react-oidc-context';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation(); // Get the current location

  const isRecipePage = location.pathname.startsWith('/recipe') || location.pathname.startsWith('/add-recipe'); // Check if the path is for recipe pages
  let isAuthenticated = false; // Replace with actual authentication logic
  console.log('isAuthenticated', isAuthenticated);
  console.log('isRecipePage', isRecipePage);
  const auth = useAuth();
  console.log('auth', auth);
  if (isRecipePage) {
    isAuthenticated = auth.isAuthenticated; // Use the authentication status from the auth object
    
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
      <div>
        <header className="recipe-header">
          <div className="header-container">
            <h1 className="header-title">Parliament & Romano Recipes</h1>
            <nav className="header-nav">
              <a href="/recipes" className="header-link">Recipes</a>
              {!isAuthenticated && (<button onClick={handleLogin} className="login-button">Login</button>)}
              {isAuthenticated && (
                <a href="/add-recipe" className="header-link">Add Recipe</a>
              )}
            </nav>
          </div>
        </header>
        <main className="content">
          {children}
        </main>
      </div>
    );
  } 
  return (
    <div className="layout">
      <header className="header">
        <div className="logo">EP</div>
        <nav>
          <ul className="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="/nba">NBA</a></li>
            <li><a href="/hockey">Hockey Analytics</a></li>
          </ul>
        </nav>
      </header>
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
