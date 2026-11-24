import { GraphQLError } from 'graphql'

export function invalidInput(
  message: string,
  fields?: Record<string, string[]>,
) {
  return new GraphQLError(message, {
    extensions: { code: 'BAD_USER_INPUT', fields },
  })
}

export function conflict(message: string) {
  return new GraphQLError(message, {
    extensions: { code: 'CONFLICT' },
  })
}

export function unauthenticated(message = 'Autenticação necessária') {
  return new GraphQLError(message, {
    extensions: { code: 'UNAUTHENTICATED' },
  })
}

export function invalidCredentials() {
  return new GraphQLError('E-mail ou senha inválidos', {
    extensions: { code: 'INVALID_CREDENTIALS' },
  })
}

export function notFound(message: string) {
  return new GraphQLError(message, {
    extensions: { code: 'NOT_FOUND' },
  })
}
