import { Navigate } from 'react-router-dom';

function PublicOnly({ token, children }) {
  if (!token) {
    return children;
  }
  return <Navigate to='/' replace />;
}

export default PublicOnly;
