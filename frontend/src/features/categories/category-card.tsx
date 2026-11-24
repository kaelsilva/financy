import { SquarePen, Trash } from 'lucide-react'
import type { Category } from '@/features/categories/api/categories'
import { CategoryIcon } from '@/shared/components/category-icon'
import { CategoryTag } from '@/shared/components/category-tag'
import { Button } from '@/shared/components/ui/button'
import { formatItemCount } from '@/shared/lib/format'

interface CategoryCardProps {
  category: Category
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export function CategoryCard({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  return (
    <article className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6">
      <div className="flex items-start justify-between">
        <CategoryIcon color={category.color} icon={category.icon} />

        <div className="flex items-center gap-2">
          {}
          <Button
            aria-label={`Excluir ${category.title}`}
            onClick={() => onDelete(category)}
            size="icon"
            type="button"
            variant="outline"
          >
            <Trash aria-hidden className="text-red-500" />
          </Button>
          <Button
            aria-label={`Editar ${category.title}`}
            onClick={() => onEdit(category)}
            size="icon"
            type="button"
            variant="outline"
          >
            <SquarePen aria-hidden className="text-gray-700" />
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <h2 className="font-semibold text-base text-foreground">
          {category.title}
        </h2>
        {/* Altura fixa de duas linhas: cards sem descricao ficam do mesmo
            tamanho dos outros, e a grade nao desalinha. */}
        <p className="line-clamp-2 h-10 text-muted-foreground text-sm leading-5">
          {category.description}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <CategoryTag color={category.color} title={category.title} />
        <span className="text-muted-foreground text-sm leading-5">
          {formatItemCount(category.transactionsCount)}
        </span>
      </div>
    </article>
  )
}
