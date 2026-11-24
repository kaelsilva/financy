import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import {
  CATEGORIES_QUERY,
  type Category,
  DELETE_CATEGORY_MUTATION,
} from '@/features/categories/api/categories'
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
import { formatItemCount } from '@/shared/lib/format'
import { toApiError } from '@/shared/lib/graphql-errors'

interface DeleteCategoryDialogProps {
  category: Category | null
  onClose: () => void
}

export function DeleteCategoryDialog({
  category,
  onClose,
}: DeleteCategoryDialogProps) {
  const [excluir, { loading }] = useMutation(DELETE_CATEGORY_MUTATION, {
    refetchQueries: [CATEGORIES_QUERY],
    awaitRefetchQueries: true,
  })

  const emUso = (category?.transactionsCount ?? 0) > 0

  async function confirmar() {
    if (!category) {
      return
    }

    try {
      await excluir({ variables: { id: category.id } })
      toast.success('Categoria excluída')
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
      open={category !== null}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {emUso ? 'Não é possível excluir' : 'Excluir categoria'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {emUso
              ? `"${category?.title}" possui ${formatItemCount(category?.transactionsCount ?? 0)} vinculados. Mova-os para outra categoria antes de excluí-la.`
              : `Tem certeza que deseja excluir "${category?.title}"? Essa ação não pode ser desfeita.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            {emUso ? 'Entendi' : 'Cancelar'}
          </AlertDialogCancel>

          {!emUso && (
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
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
