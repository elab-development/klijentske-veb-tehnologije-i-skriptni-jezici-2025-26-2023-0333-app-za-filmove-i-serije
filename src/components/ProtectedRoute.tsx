import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../contexts/useAuth';
import NavigationMenu from './NavigationMenu';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate replace to='/login' />;
  }

  return (
    <div className='min-h-screen bg-[#e8edf7] text-[#081023]'>
      <NavigationMenu />
      <div className='pt-18'>{children}</div>
    </div>
  );
};

export default ProtectedRoute;
