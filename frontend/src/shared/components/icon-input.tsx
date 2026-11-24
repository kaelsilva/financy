import type { LucideIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'

import { Input } from '@/shared/components/ui/input'
import { cn } from '@/shared/lib/utils'

interface IconInputProps extends ComponentProps<typeof Input> {
  icon: LucideIcon

  trailing?: ReactNode
}

export function IconInput({
  icon: Icone,
  trailing,
  className,
  ...props
}: IconInputProps) {
  return (
    <div className="relative">
      <Icone
        aria-hidden
        className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3.25 size-4 text-gray-400"
      />

      <Input
        className={cn('pl-10.25', trailing && 'pr-10.25', className)}
        {...props}
      />

      {trailing && (
        <div className="-translate-y-1/2 absolute top-1/2 right-3.25 flex">
          {trailing}
        </div>
      )}
    </div>
  )
}
