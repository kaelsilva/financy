import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/use-auth'
import { FullScreenLoader } from '@/shared/components/full-screen-loader'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <FullScreenLoader />
  }

  if (!user) {
    return <Navigate replace to="/" />
  }

  return children
}
