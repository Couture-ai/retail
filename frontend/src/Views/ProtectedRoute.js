import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const VITE_ROUTE_PREFIX = import.meta.env.VITE_ROUTE_PREFIX || '';
  const location = useLocation();
  const { role } = useContext(AuthContext);

  if (!role) {
    // Redirect to login page and store the current location
    return <Navigate to={`${VITE_ROUTE_PREFIX}/login`} state={{ from: location }} replace />;
  }

  return children;
};
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoute;
