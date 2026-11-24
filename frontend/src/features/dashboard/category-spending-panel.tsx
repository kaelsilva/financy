import type { CategorySpending } from '@/features/dashboard/api/dashboard'
import { CategoryTag } from '@/shared/components/category-tag'
import { formatCurrency, formatItemCount } from '@/shared/lib/format'

import { SectionHeader } from './section-header'

interface CategorySpendingPanelProps {
  items: CategorySpending[]
  loading: boolean
}

export function CategorySpendingPanel({
  items,
  loading,
}: CategorySpendingPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-card">
      <SectionHeader
        linkLabel="Gerenciar"
        linkTo="/categorias"
        title="Categorias"
      />

      <div className="space-y-5 p-6">
        {items.length === 0 && (
          <p className="py-4 text-center text-muted-foreground text-sm">
            {loading ? 'Carregando…' : 'Nenhuma categoria com movimentação.'}
          </p>
        )}

        {items.map(({ category, totalAmountInCents }) => (
          <div className="flex items-center gap-1" key={category.id}>
            <CategoryTag color={category.color} title={category.title} />
            <span className="flex-1 text-right text-muted-foreground text-sm">
              {formatItemCount(category.transactionsCount)}
            </span>
            {}
            <span className="min-w-22 text-right font-semibold text-foreground text-sm">
              {formatCurrency(totalAmountInCents)}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
