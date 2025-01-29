import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import AuthPage from '@/pages/AuthPage';

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element  }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const {avatar, username}  = useSelector((state: RootState) => state.user);
  console.log("ProtectedRoute", isAuthenticated, avatar, username)
  

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/" />;
  }
  // if (window.location.pathname === '/complete-profile') {
  //   return element;
  // }
  if (!avatar || !username) {    
    console.log("Profile incomplete, redirecting to complete profile");
    return <Navigate to="/complete-profile" />;
  }
  return element;
};

export default ProtectedRoute;
