import { userResolvers } from '../../modules/auth/auth.resolver.js'
import { categoryResolvers } from '../../modules/category/category.resolver.js'
import { dashboardResolvers } from '../../modules/dashboard/dashboard.resolver.js'
import { transactionResolvers } from '../../modules/transaction/transaction.resolver.js'
import { dateTimeScalar } from '../scalars/date-time.js'
import { safeIntScalar } from '../scalars/safe-int.js'
import { baseResolvers } from './base.js'

export const resolvers = {
  DateTime: dateTimeScalar,
  SafeInt: safeIntScalar,

  Query: {
    ...baseResolvers.Query,
    ...userResolvers.Query,
    ...categoryResolvers.Query,
    ...transactionResolvers.Query,
    ...dashboardResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...transactionResolvers.Mutation,
  },
}
