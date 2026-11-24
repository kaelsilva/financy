import { type ReactNode, useEffect } from 'react'

import { Label } from '@/shared/components/ui/label'

interface FormFieldProps {
  id: string
  label: string

  hint?: string
  error?: string
  children: ReactNode
}

export function FormField({
  id,
  label,
  hint,
  error,
  children,
}: FormFieldProps) {
  const mensagem = error ?? hint
  const mensagemId = `${id}-mensagem`

  /**
   * Liga a dica ou o erro ao campo, para o leitor de tela le-los junto com o
   * rotulo ao focar o campo.
   *
   * A ligacao e feita pelo id, e nao por props no filho, porque o campo pode
   * estar em qualquer profundidade: dentro de um Controller, de um Popover
   * ou de um Select. Todos ja recebem o mesmo `id` do FormField.
   */
  useEffect(() => {
    const campo = document.getElementById(id)

    if (!campo || !mensagem) {
      return
    }

    campo.setAttribute('aria-describedby', mensagemId)

    return () => campo.removeAttribute('aria-describedby')
  }, [id, mensagem, mensagemId])

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      {children}

      {mensagem && (
        <p
          className={
            error
              ? 'text-destructive text-xs leading-4'
              : 'text-gray-500 text-xs leading-4'
          }
          id={mensagemId}
          role={error ? 'alert' : undefined}
        >
          {mensagem}
        </p>
      )}
    </div>
  )
}
