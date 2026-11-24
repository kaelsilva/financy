import { useEffect, useState } from 'react'

export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [atrasado, setAtrasado] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setAtrasado(value), delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return atrasado
}
