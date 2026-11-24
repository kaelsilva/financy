import type { Category } from '@/features/categories/api/categories'

export interface CategorySummary {
  totalCategories: number
  totalTransactions: number

  mostUsed: Category | null
}

export function summarizeCategories(categories: Category[]): CategorySummary {
  let totalTransactions = 0
  let mostUsed: Category | null = null

  for (const categoria of categories) {
    totalTransactions += categoria.transactionsCount

    const superaAtual =
      mostUsed === null ||
      categoria.transactionsCount > mostUsed.transactionsCount

    if (categoria.transactionsCount > 0 && superaAtual) {
      mostUsed = categoria
    }
  }

  return {
    totalCategories: categories.length,
    totalTransactions,
    mostUsed,
  }
}
