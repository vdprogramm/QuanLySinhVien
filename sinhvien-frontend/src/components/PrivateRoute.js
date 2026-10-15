import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({children}) {
  const account = sessionStorage.getItem('account');
  const credentials = sessionStorage.getItem('basicAuth');
  return account && credentials ? children : <Navigate to="/login" replace />;
}
export default PrivateRoute;
