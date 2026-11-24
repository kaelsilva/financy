import { lazy } from 'react'

export const SignInPage = lazy(() =>
  import('@/features/auth/pages/sign-in').then((module) => ({
    default: module.SignInPage,
  })),
)

export const SignUpPage = lazy(() =>
  import('@/features/auth/pages/sign-up').then((module) => ({
    default: module.SignUpPage,
  })),
)

export const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/dashboard').then((module) => ({
    default: module.DashboardPage,
  })),
)

export const TransactionsPage = lazy(() =>
  import('@/features/transactions/pages/transactions').then((module) => ({
    default: module.TransactionsPage,
  })),
)

export const CategoriesPage = lazy(() =>
  import('@/features/categories/pages/categories').then((module) => ({
    default: module.CategoriesPage,
  })),
)

export const AccountPage = lazy(() =>
  import('@/features/auth/pages/account').then((module) => ({
    default: module.AccountPage,
  })),
)

export const NotFoundPage = lazy(() =>
  import('@/shared/pages/not-found').then((module) => ({
    default: module.NotFoundPage,
  })),
)
