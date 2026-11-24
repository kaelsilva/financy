import type { z } from 'zod'

export function toFieldErrors(error: z.ZodError): Record<string, string[]> {
  const fields: Record<string, string[]> = {}

  for (const issue of error.issues) {
    const field = issue.path.join('.') || '_'
    fields[field] = [...(fields[field] ?? []), issue.message]
  }

  return fields
}
