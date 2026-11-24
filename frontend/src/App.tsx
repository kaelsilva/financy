import { ApolloProvider } from '@apollo/client/react'
import { AuthProvider } from '@/features/auth/auth-provider'
import { AppRoutes } from '@/routes/app-routes'
import { Toaster } from '@/shared/components/ui/sonner'
import { apolloClient } from '@/shared/lib/apollo'

export function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" />
      </AuthProvider>
    </ApolloProvider>
  )
}
