import React, { useContext, useMemo } from 'react';
import { Redirect } from 'wouter';
import { AuthContext } from '@/context/AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  
  // Get the app prefix from environment variables
  const loginPath = useMemo(() => {
    const APP_PREFIX = import.meta.env.VITE_APP_PREFIX || '';
    return APP_PREFIX ? `/${APP_PREFIX}/login` : '/login';
  }, []);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect to={loginPath} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

