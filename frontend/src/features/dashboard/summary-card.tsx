import type { LucideIcon } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

interface SummaryCardProps {
  icon: LucideIcon
  iconClassName: string
  label: string
  value: string
}

export function SummaryCard({
  icon: Icone,
  iconClassName,
  label,
  value,
}: SummaryCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <Icone aria-hidden className={cn('size-5', iconClassName)} />
        <span className="font-medium text-gray-500 text-xs uppercase leading-4 tracking-[0.6px]">
          {label}
        </span>
      </div>

      <p className="truncate font-bold text-[28px] text-foreground leading-8">
        {value}
      </p>
    </div>
  )
}
