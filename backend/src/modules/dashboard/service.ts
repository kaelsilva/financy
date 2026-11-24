import type { PrismaClient, TransactionType } from '@prisma/client'
import { z } from 'zod'

import { invalidInput } from '../../lib/errors.js'
import { toFieldErrors } from '../../lib/validations.js'
import { categorySelect, toCategory } from '../category/service.js'

const CATEGORIAS_NO_PAINEL = 5

const periodoSchema = z.object({
  month: z.number().int().min(1, 'Mês inválido').max(12, 'Mês inválido'),
  year: z.number().int().min(1970, 'Ano inválido').max(2200, 'Ano inválido'),
})

interface SomaPorTipo {
  type: TransactionType
  _sum: { amount: number | null }
}

function somaDoTipo(grupos: SomaPorTipo[], tipo: TransactionType): number {
  return grupos.find((grupo) => grupo.type === tipo)?._sum.amount ?? 0
}

export async function getDashboardSummary(
  prisma: PrismaClient,
  userId: string,
  input: unknown,
) {
  const parsed = periodoSchema.safeParse(input)

  if (!parsed.success) {
    throw invalidInput('Período inválido', toFieldErrors(parsed.error))
  }

  const { month, year } = parsed.data
  const inicioDoMes = new Date(Date.UTC(year, month - 1, 1))
  const inicioDoProximoMes = new Date(Date.UTC(year, month, 1))

  const [geral, doMes, porCategoria] = await prisma.$transaction([
    prisma.transaction.groupBy({
      by: ['type'],
      where: { userId },
      _sum: { amount: true },
      orderBy: { type: 'asc' },
    }),
    prisma.transaction.groupBy({
      by: ['type'],
      where: { userId, date: { gte: inicioDoMes, lt: inicioDoProximoMes } },
      _sum: { amount: true },
      orderBy: { type: 'asc' },
    }),
    prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { userId },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: CATEGORIAS_NO_PAINEL,
    }),
  ])

  const ids = porCategoria.map((grupo) => grupo.categoryId)

  const categorias = await prisma.category.findMany({
    where: { id: { in: ids }, userId },
    select: categorySelect,
  })

  const porId = new Map(
    categorias.map((categoria) => [categoria.id, categoria]),
  )

  return {
    balanceInCents: somaDoTipo(geral, 'INCOME') - somaDoTipo(geral, 'EXPENSE'),
    monthIncomeInCents: somaDoTipo(doMes, 'INCOME'),
    monthExpenseInCents: somaDoTipo(doMes, 'EXPENSE'),

    categories: porCategoria.flatMap((grupo) => {
      const categoria = porId.get(grupo.categoryId)

      return categoria
        ? [
            {
              category: toCategory(categoria),
              totalAmountInCents: grupo._sum.amount ?? 0,
            },
          ]
        : []
    }),
  }
}
