import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import type { TransactionType } from '@/features/transactions/api/transactions'

export interface TransactionFiltersState {
  search: string
  type: TransactionType | ''
  categoryId: string

  period: string
  page: number
}

const CHAVES: Record<keyof TransactionFiltersState, string> = {
  search: 'busca',
  type: 'tipo',
  categoryId: 'categoria',
  period: 'periodo',
  page: 'pagina',
}

function lerTipo(valor: string | null): TransactionType | '' {
  return valor === 'INCOME' || valor === 'EXPENSE' ? valor : ''
}

function lerPagina(valor: string | null): number {
  const numero = Number(valor)

  return Number.isInteger(numero) && numero > 0 ? numero : 1
}

export function useTransactionFilters() {
  const [params, setParams] = useSearchParams()

  const filters = useMemo<TransactionFiltersState>(
    () => ({
      search: params.get(CHAVES.search) ?? '',
      type: lerTipo(params.get(CHAVES.type)),
      categoryId: params.get(CHAVES.categoryId) ?? '',
      period: params.get(CHAVES.period) ?? '',
      page: lerPagina(params.get(CHAVES.page)),
    }),
    [params],
  )

  const update = useCallback(
    (mudancas: Partial<TransactionFiltersState>) => {
      setParams(
        (atuais) => {
          const proximos = new URLSearchParams(atuais)

          for (const [campo, valor] of Object.entries(mudancas)) {
            const chave = CHAVES[campo as keyof TransactionFiltersState]
            const vazio = valor === '' || valor === 1 || valor === undefined

            if (vazio) {
              proximos.delete(chave)
            } else {
              proximos.set(chave, String(valor))
            }
          }

          if (!('page' in mudancas)) {
            proximos.delete(CHAVES.page)
          }

          return proximos
        },

        { replace: true },
      )
    },
    [setParams],
  )

  const hasActiveFilters = Boolean(
    filters.search || filters.type || filters.categoryId || filters.period,
  )

  return { filters, update, hasActiveFilters }
}
