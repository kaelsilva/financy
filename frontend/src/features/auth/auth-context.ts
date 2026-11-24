import { createContext } from 'react'

import type { AuthenticatedUser } from '@/features/auth/api/session'

export interface SignInInput {
  email: string
  password: string

  remember: boolean
}

export interface SignUpInput {
  name: string
  email: string
  password: string
}

export interface AuthContextValue {
  user: AuthenticatedUser | null

  isLoading: boolean
  signIn: (input: SignInInput) => Promise<void>
  signUp: (input: SignUpInput) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
