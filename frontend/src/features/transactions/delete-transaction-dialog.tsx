import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { CATEGORIES_QUERY } from '@/features/categories/api/categories'
import {
  DELETE_TRANSACTION_MUTATION,
  TRANSACTIONS_QUERY,
  type Transaction,
} from '@/features/transactions/api/transactions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog'
import { formatSignedCurrency } from '@/shared/lib/format'
import { toApiError } from '@/shared/lib/graphql-errors'

interface DeleteTransactionDialogProps {
  transaction: Transaction | null
  onClose: () => void
}

export function DeleteTransactionDialog({
  transaction,
  onClose,
}: DeleteTransactionDialogProps) {
  const [excluir, { loading }] = useMutation(DELETE_TRANSACTION_MUTATION, {
    refetchQueries: [TRANSACTIONS_QUERY, CATEGORIES_QUERY],
    awaitRefetchQueries: true,
  })

  async function confirmar() {
    if (!transaction) {
      return
    }

    try {
      await excluir({ variables: { id: transaction.id } })
      toast.success('Transação excluída')
      onClose()
    } catch (erro) {
      toast.error(toApiError(erro).message)
    }
  }

  return (
    <AlertDialog
      onOpenChange={(aberto) => {
        if (!aberto) {
          onClose()
        }
      }}
      open={transaction !== null}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir transação</AlertDialogTitle>
          <AlertDialogDescription>
            {transaction &&
              `Tem certeza que deseja excluir "${transaction.description}" (${formatSignedCurrency(transaction.amountInCents, transaction.type)})? Essa ação não pode ser desfeita.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(evento) => {
              evento.preventDefault()
              confirmar()
            }}
            variant="destructive"
          >
            {loading ? 'Excluindo…' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
