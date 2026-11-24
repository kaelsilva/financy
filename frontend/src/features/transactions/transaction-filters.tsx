import { useQuery } from '@apollo/client/react'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { CATEGORIES_QUERY } from '@/features/categories/api/categories'
import { IconInput } from '@/shared/components/icon-input'
import { Label } from '@/shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value'

import { buildPeriodOptions } from './period-options'
import type { useTransactionFilters } from './use-transaction-filters'

const TODOS = 'todos'

type FiltersApi = ReturnType<typeof useTransactionFilters>

interface TransactionFiltersProps {
  filters: FiltersApi['filters']
  onChange: FiltersApi['update']
}

export function TransactionFilters({
  filters,
  onChange,
}: TransactionFiltersProps) {
  const { data } = useQuery(CATEGORIES_QUERY)
  const periodos = useMemo(() => buildPeriodOptions(), [])

  const [busca, setBusca] = useState(filters.search)
  const buscaAtrasada = useDebouncedValue(busca, 300)

  const [buscaNaUrl, setBuscaNaUrl] = useState(filters.search)

  if (filters.search !== buscaNaUrl) {
    setBuscaNaUrl(filters.search)
    setBusca(filters.search)
  }

  useEffect(() => {
    const assentou = buscaAtrasada === busca

    if (assentou && buscaAtrasada !== filters.search) {
      onChange({ search: buscaAtrasada })
    }
  }, [busca, buscaAtrasada, filters.search, onChange])

  return (
    <section className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-card px-6 pt-5 pb-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-2">
        <Label htmlFor="filtro-busca">Buscar</Label>
        <IconInput
          icon={Search}
          id="filtro-busca"
          onChange={(evento) => setBusca(evento.target.value)}
          placeholder="Buscar por descrição"
          type="search"
          value={busca}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="filtro-tipo">Tipo</Label>
        <Select
          onValueChange={(valor) =>
            onChange({
              type: valor === TODOS ? '' : (valor as 'INCOME' | 'EXPENSE'),
            })
          }
          value={filters.type || TODOS}
        >
          <SelectTrigger id="filtro-tipo">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODOS}>Todos</SelectItem>
            <SelectItem value="INCOME">Entrada</SelectItem>
            <SelectItem value="EXPENSE">Saída</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="filtro-categoria">Categoria</Label>
        <Select
          onValueChange={(valor) =>
            onChange({ categoryId: valor === TODOS ? '' : valor })
          }
          value={filters.categoryId || TODOS}
        >
          <SelectTrigger id="filtro-categoria">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODOS}>Todas</SelectItem>
            {data?.categories.map((categoria) => (
              <SelectItem key={categoria.id} value={categoria.id}>
                {categoria.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="filtro-periodo">Período</Label>
        <Select
          onValueChange={(valor) =>
            onChange({ period: valor === TODOS ? '' : valor })
          }
          value={filters.period || TODOS}
        >
          <SelectTrigger id="filtro-periodo">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODOS}>Todos os períodos</SelectItem>
            {periodos.map((periodo) => (
              <SelectItem key={periodo.value} value={periodo.value}>
                {periodo.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  )
}
