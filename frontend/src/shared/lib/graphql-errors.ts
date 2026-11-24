import { CombinedGraphQLErrors, ServerError } from '@apollo/client'

export interface ApiError {
  code?: string
  message: string

  fields?: Record<string, string[]>
}

export function toApiError(error: unknown): ApiError {
  if (CombinedGraphQLErrors.is(error)) {
    const primeiro = error.errors[0]
    const extensions = primeiro?.extensions ?? {}

    return {
      code: typeof extensions.code === 'string' ? extensions.code : undefined,
      message: primeiro?.message ?? 'Erro inesperado',
      fields: extensions.fields as Record<string, string[]> | undefined,
    }
  }

  if (ServerError.is(error)) {
    return fromServerError(error)
  }

  if (error instanceof Error) {
    return { message: error.message }
  }

  return { message: 'Não foi possível concluir a operação' }
}

function fromServerError(error: ServerError): ApiError {
  try {
    const body = JSON.parse(error.bodyText) as {
      errors?: { message?: string; extensions?: { code?: unknown } }[]
    }
    const primeiro = body.errors?.[0]

    if (primeiro?.message) {
      const code = primeiro.extensions?.code
      return {
        code: typeof code === 'string' ? code : undefined,
        message: primeiro.message,
      }
    }
  } catch {}

  return { message: 'O servidor recusou a requisição. Tente novamente.' }
}
