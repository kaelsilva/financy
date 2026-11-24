import type { GraphQLContext } from '../../graphql/context.js'
import { updateProfile } from '../user/service.js'
import { requireAuthentication } from './authentication.guard.js'
import {
  type AuthenticatedUserData,
  type AuthResult,
  signIn,
  signUp,
} from './service.js'

export const userResolvers = {
  Query: {
    me: (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ): AuthenticatedUserData => requireAuthentication(context),
  },

  Mutation: {
    signUp: (
      _parent: unknown,
      args: { input: unknown },
      context: GraphQLContext,
    ): Promise<AuthResult> => signUp(context.prisma, args.input),

    signIn: (
      _parent: unknown,
      args: { input: unknown },
      context: GraphQLContext,
    ): Promise<AuthResult> => signIn(context.prisma, args.input),

    updateProfile: (
      _parent: unknown,
      args: { input: unknown },
      context: GraphQLContext,
    ) => {
      const user = requireAuthentication(context)

      return updateProfile(context.prisma, user.id, args.input)
    },
  },
}
