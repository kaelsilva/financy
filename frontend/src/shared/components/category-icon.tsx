import {
  getCategoryAppearance,
  getCategoryIcon,
} from '@/shared/lib/category-appearance'
import { cn } from '@/shared/lib/utils'

interface CategoryIconProps {
  icon: string
  color: string
  className?: string
}

export function CategoryIcon({ icon, color, className }: CategoryIconProps) {
  const { soft, text } = getCategoryAppearance(color)
  const Icone = getCategoryIcon(icon)

  return (
    <span
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-lg',
        soft,
        text,
        className,
      )}
    >
      <Icone aria-hidden className="size-4" />
    </span>
  )
}
