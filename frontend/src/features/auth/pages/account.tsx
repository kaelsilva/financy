import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogOut, Mail, User } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { UPDATE_PROFILE_MUTATION } from '@/features/auth/api/session'
import { useAuth } from '@/features/auth/use-auth'
import { FormField } from '@/shared/components/form-field'
import { IconInput } from '@/shared/components/icon-input'
import { PageShell } from '@/shared/components/page-shell'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { getInitials } from '@/shared/lib/format'
import { toApiError } from '@/shared/lib/graphql-errors'

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(120, 'O nome deve ter no máximo 120 caracteres'),
})

type ProfileFormData = z.infer<typeof profileSchema>

export function AccountPage() {
  const { user, signOut } = useAuth()

  const [atualizarPerfil] = useMutation(UPDATE_PROFILE_MUTATION)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),

    defaultValues: { name: user?.name ?? '' },
  })

  async function aoEnviar(dados: ProfileFormData) {
    try {
      await atualizarPerfil({ variables: { input: { name: dados.name } } })
      toast.success('Perfil atualizado')
    } catch (erro) {
      const apiError = toApiError(erro)

      if (apiError.fields?.name?.[0]) {
        setError('name', { message: apiError.fields.name[0] })
        return
      }

      toast.error(apiError.message)
    }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-md space-y-8 rounded-xl border border-border bg-card p-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <div
            aria-hidden
            className="flex size-16 items-center justify-center rounded-full bg-gray-300 font-medium text-foreground text-xl"
          >
            {user ? getInitials(user.name) : ''}
          </div>

          <div>
            <h1 className="font-semibold text-foreground text-xl">
              {user?.name}
            </h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <Separator />

        <form
          className="space-y-4"
          id="profile-form"
          noValidate
          onSubmit={handleSubmit(aoEnviar)}
        >
          <FormField
            error={errors.name?.message}
            id="profile-name"
            label="Nome completo"
          >
            <IconInput
              aria-invalid={Boolean(errors.name)}
              autoComplete="name"
              icon={User}
              id="profile-name"
              {...register('name')}
            />
          </FormField>

          {}
          <FormField
            hint="O e-mail não pode ser alterado"
            id="profile-email"
            label="E-mail"
          >
            <IconInput
              className="text-gray-500"
              icon={Mail}
              id="profile-email"
              readOnly
              value={user?.email ?? ''}
            />
          </FormField>
        </form>

        {}
        <div className="space-y-4">
          <Button
            className="w-full"
            disabled={isSubmitting}
            form="profile-form"
            type="submit"
          >
            {isSubmitting ? 'Salvando…' : 'Salvar alterações'}
          </Button>

          <Button
            className="w-full"
            onClick={signOut}
            type="button"
            variant="outline"
          >
            <LogOut aria-hidden className="text-red-500" />
            Sair da conta
          </Button>
        </div>
      </div>
    </PageShell>
  )
}
