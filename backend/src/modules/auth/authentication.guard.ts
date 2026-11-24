import type { GraphQLContext } from '../../graphql/context.js'
import { unauthenticated } from '../../lib/errors.js'

import type { AuthenticatedUserData } from './service.js'

export function requireAuthentication(
  context: GraphQLContext,
): AuthenticatedUserData {
  if (!context.authenticatedUser) {
    throw unauthenticated()
  }

  return context.authenticatedUser
}
