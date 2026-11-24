import type { GraphQLContext } from '../../graphql/context.js'
import { requireAuthentication } from '../auth/authentication.guard.js'
import { getDashboardSummary } from './service.js'

export const dashboardResolvers = {
  Query: {
    dashboardSummary: (
      _parent: unknown,
      args: { month: number; year: number },
      context: GraphQLContext,
    ) =>
      getDashboardSummary(
        context.prisma,
        requireAuthentication(context).id,
        args,
      ),
  },
}
