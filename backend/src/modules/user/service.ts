import type { PrismaClient } from '@prisma/client'
import { z } from 'zod'

import { invalidInput } from '../../lib/errors.js'
import { toFieldErrors } from '../../lib/validations.js'

const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(120, 'O nome deve ter no máximo 120 caracteres'),
})

export async function updateProfile(
  prisma: PrismaClient,
  userId: string,
  input: unknown,
) {
  const parsed = updateProfileSchema.safeParse(input)

  if (!parsed.success) {
    throw invalidInput('Dados inválidos', toFieldErrors(parsed.error))
  }

  return prisma.user.update({
    where: { id: userId },
    data: { name: parsed.data.name },
    select: { id: true, name: true, email: true },
  })
}
