import type { ComponentProps } from 'react'

import { Input } from '@/shared/components/ui/input'
import { formatCentsForInput, parseCurrencyToCents } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'

const LIMITE_EM_CENTAVOS = 1_000_000_000

interface CurrencyInputProps
  extends Omit<
    ComponentProps<typeof Input>,
    'value' | 'onChange' | 'type' | 'inputMode'
  > {
  value: number
  onValueChange: (centavos: number) => void
}

export function CurrencyInput({
  value,
  onValueChange,
  className,
  ...props
}: CurrencyInputProps) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3.25 font-medium text-foreground text-sm"
      >
        R$
      </span>
      <Input
        {...props}
        className={cn('pl-11', className)}
        inputMode="numeric"
        onChange={(evento) =>
          onValueChange(
            Math.min(
              parseCurrencyToCents(evento.target.value),
              LIMITE_EM_CENTAVOS,
            ),
          )
        }
        value={formatCentsForInput(value)}
      />
    </div>
  )
}
