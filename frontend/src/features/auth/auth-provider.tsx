import { useApolloClient, useMutation, useQuery } from '@apollo/client/react'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  type AuthenticatedUser,
  ME_QUERY,
  SIGN_IN_MUTATION,
  SIGN_UP_MUTATION,
} from '@/features/auth/api/session'

import {
  clearStoredToken,
  getStoredToken,
  storeToken,
} from '@/shared/lib/auth-storage'
import { onSessionExpired } from '@/shared/lib/session-events'

import {
  AuthContext,
  type AuthContextValue,
  type SignInInput,
  type SignUpInput,
} from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient()

  const [token, setToken] = useState<string | null>(() => getStoredToken())

  const { data, loading } = useQuery(ME_QUERY, { skip: !token })

  const [executarSignIn] = useMutation(SIGN_IN_MUTATION)
  const [executarSignUp] = useMutation(SIGN_UP_MUTATION)

  useEffect(() => {
    return onSessionExpired(() => {
      clearStoredToken()
      setToken(null)
    })
  }, [])

  const aplicarSessao = useCallback(
    (novoToken: string, usuario: AuthenticatedUser, lembrar: boolean) => {
      storeToken(novoToken, lembrar)
      setToken(novoToken)

      client.writeQuery({ query: ME_QUERY, data: { me: usuario } })
    },
    [client],
  )

  const signIn = useCallback(
    async (input: SignInInput) => {
      const { remember, ...credenciais } = input

      const resultado = await executarSignIn({
        variables: { input: credenciais },
      })
      const payload = resultado.data?.signIn

      if (!payload) {
        throw new Error('Resposta inesperada do servidor')
      }

      aplicarSessao(payload.token, payload.user, remember)
    },
    [executarSignIn, aplicarSessao],
  )

  const signUp = useCallback(
    async (input: SignUpInput) => {
      const resultado = await executarSignUp({ variables: { input } })
      const payload = resultado.data?.signUp

      if (!payload) {
        throw new Error('Resposta inesperada do servidor')
      }

      aplicarSessao(payload.token, payload.user, true)
    },
    [executarSignUp, aplicarSessao],
  )

  const signOut = useCallback(async () => {
    clearStoredToken()
    setToken(null)

    await client.clearStore()
  }, [client])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: token ? (data?.me ?? null) : null,
      isLoading: Boolean(token) && loading,
      signIn,
      signUp,
      signOut,
    }),
    [token, data, loading, signIn, signUp, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
