import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { type ReactNode } from 'react'

interface PublicRouteProps {
  children: ReactNode
  redirectTo?: string
}

export const PublicRoute = ({ children, redirectTo = '/series' }: PublicRouteProps) => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    // Redirigir a series si ya está autenticado
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}
