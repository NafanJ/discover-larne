import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: 'visitor' | 'business_owner' | 'admin';
  fallback?: React.ReactNode;
}

export function AuthGuard({ 
  children, 
  requireAuth = false, 
  requireRole,
  fallback 
}: AuthGuardProps) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireRole && (!role || !hasRequiredRole(role, requireRole))) {
    return fallback || (
      <div className="text-center py-8">
        <p className="text-muted-foreground">You don't have permission to access this content.</p>
      </div>
    );
  }

  return <>{children}</>;
}

function hasRequiredRole(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    admin: 3,
    business_owner: 2,
    visitor: 1,
  };

  return roleHierarchy[userRole as keyof typeof roleHierarchy] >= 
         roleHierarchy[requiredRole as keyof typeof roleHierarchy];
}