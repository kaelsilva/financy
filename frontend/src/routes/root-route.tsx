import { useAuth } from '@/features/auth/use-auth'
import { FullScreenLoader } from '@/shared/components/full-screen-loader'

import { DashboardPage, SignInPage } from './lazy-pages'

export function RootRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <FullScreenLoader />
  }

  return user ? <DashboardPage /> : <SignInPage />
}
