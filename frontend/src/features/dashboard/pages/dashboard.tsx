import { useQuery } from '@apollo/client/react'
import { CircleArrowDown, CircleArrowUp, Wallet } from 'lucide-react'
import { useState } from 'react'
import { DASHBOARD_QUERY } from '@/features/dashboard/api/dashboard'
import { CategorySpendingPanel } from '@/features/dashboard/category-spending-panel'
import { RecentTransactions } from '@/features/dashboard/recent-transactions'
import { SummaryCard } from '@/features/dashboard/summary-card'
import { TRANSACTIONS_QUERY } from '@/features/transactions/api/transactions'
import { TransactionFormDialog } from '@/features/transactions/transaction-form-dialog'
import { PageShell } from '@/shared/components/page-shell'
import { Button } from '@/shared/components/ui/button'
import { formatCurrency } from '@/shared/lib/format'

function valor(centavos: number | undefined): string {
  return centavos === undefined ? '—' : formatCurrency(centavos)
}

export function DashboardPage() {
  const [periodo] = useState(() => {
    const hoje = new Date()

    return { month: hoje.getMonth() + 1, year: hoje.getFullYear() }
  })

  const [formularioAberto, setFormularioAberto] = useState(false)

  const resumo = useQuery(DASHBOARD_QUERY, {
    variables: periodo,
    fetchPolicy: 'cache-and-network',
  })

  const recentes = useQuery(TRANSACTIONS_QUERY, {
    variables: { page: 1, pageSize: 5 },
    fetchPolicy: 'cache-and-network',
  })

  const dados = resumo.data?.dashboardSummary

  return (
    <PageShell>
      {}
      <h1 className="sr-only">Dashboard</h1>
      <div className="space-y-6">
        {resumo.error && !dados && (
          <div className="flex items-center justify-between rounded-xl border border-border bg-card px-6 py-4">
            <p className="text-destructive text-sm">
              Não foi possível carregar os indicadores.
            </p>
            <Button
              onClick={() => resumo.refetch()}
              size="md"
              type="button"
              variant="outline"
            >
              Tentar novamente
            </Button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <SummaryCard
            icon={Wallet}
            iconClassName="text-category-purple"
            label="Saldo total"
            value={valor(dados?.balanceInCents)}
          />
          <SummaryCard
            icon={CircleArrowUp}
            iconClassName="text-category-green"
            label="Receitas do mês"
            value={valor(dados?.monthIncomeInCents)}
          />
          <SummaryCard
            icon={CircleArrowDown}
            iconClassName="text-category-red"
            label="Despesas do mês"
            value={valor(dados?.monthExpenseInCents)}
          />
        </section>

        {}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentTransactions
              loading={recentes.loading}
              onNewTransaction={() => setFormularioAberto(true)}
              transactions={recentes.data?.transactions.items ?? []}
            />
          </div>

          <CategorySpendingPanel
            items={dados?.categories ?? []}
            loading={resumo.loading}
          />
        </div>
      </div>

      <TransactionFormDialog
        onOpenChange={setFormularioAberto}
        onSaved={() => resumo.refetch()}
        open={formularioAberto}
        transaction={null}
      />
    </PageShell>
  )
}
