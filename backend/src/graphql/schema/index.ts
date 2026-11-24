import { userTypeDefs } from '../../modules/auth/auth.schema.js'
import { categoryTypeDefs } from '../../modules/category/category.schema.js'
import { dashboardTypeDefs } from '../../modules/dashboard/dashboard.schema.js'
import { transactionTypeDefs } from '../../modules/transaction/transaction.schema.js'
import { baseTypeDefs } from './base.js'

export const typeDefs = [
  baseTypeDefs,
  userTypeDefs,
  categoryTypeDefs,
  transactionTypeDefs,
  dashboardTypeDefs,
]
