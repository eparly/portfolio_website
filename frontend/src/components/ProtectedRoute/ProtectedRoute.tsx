import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from 'react-oidc-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  cognitoAuthConfig: any;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, cognitoAuthConfig }) => {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Error: {auth.error.message}</div>;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/recipes" replace />;
  }

  return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
};

export default ProtectedRoute;