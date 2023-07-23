import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (token === null) {
      return false;
    } else return true;
  };
  const loggedIn = isAuthenticated();

  return loggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
