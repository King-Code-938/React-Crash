import { Navigate } from 'react-router-dom';

function PublicOnly({ token, children }) {
  if (token) {
    return <Navigate to='/' replace />;
  }
  return children;
}

export default PublicOnly;
