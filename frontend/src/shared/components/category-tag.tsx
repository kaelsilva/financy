import { getCategoryAppearance } from '@/shared/lib/category-appearance'
import { cn } from '@/shared/lib/utils'

interface CategoryTagProps {
  title: string
  color: string
  className?: string
}

export function CategoryTag({ title, color, className }: CategoryTagProps) {
  const { soft, strong } = getCategoryAppearance(color)

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 font-medium text-sm leading-5',
        soft,
        strong,
        className,
      )}
    >
      {title}
    </span>
  )
}
