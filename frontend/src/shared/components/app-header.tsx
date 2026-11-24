import { NavLink } from 'react-router-dom'

import logoUrl from '@/assets/logo.svg'
import { useAuth } from '@/features/auth/use-auth'
import { getInitials } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'

const LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/transacoes', label: 'Transações' },
  { to: '/categorias', label: 'Categorias' },
]

export function AppHeader() {
  const { user } = useAuth()

  return (
    <header className="border-border border-b bg-card">
      <div className="relative mx-auto flex h-17 max-w-7xl items-center justify-between px-12">
        <img alt="Financy" className="h-6 w-25" src={logoUrl} />

        {}
        <nav className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex gap-5 text-sm">
          {LINKS.map((link) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  'leading-5 transition-colors',
                  isActive
                    ? 'font-semibold text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )
              }
              end={link.to === '/'}
              key={link.to}
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {}
        <NavLink
          className="flex size-9 items-center justify-center rounded-full bg-gray-300 font-medium text-foreground text-sm"
          to="/conta"
        >
          <span aria-hidden>{user ? getInitials(user.name) : ''}</span>
          <span className="sr-only">Minha conta</span>
        </NavLink>
      </div>
    </header>
  )
}
