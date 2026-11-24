import type { PrismaClient } from '@prisma/client'
import type { Request } from 'express'

import { verifyToken } from '../lib/jwt.js'
import { prisma } from '../lib/prisma.js'
import type { AuthenticatedUserData } from '../modules/auth/service.js'

export interface GraphQLContext {
  prisma: PrismaClient
  authenticatedUser: AuthenticatedUserData | null
}

function extractBearerToken(request: Request): string | null {
  const header = request.headers.authorization

  if (!header) {
    return null
  }

  const [scheme, token] = header.split(' ')

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null
  }

  return token
}

export async function createContext({
  req,
}: {
  req: Request
}): Promise<GraphQLContext> {
  const token = extractBearerToken(req)

  if (!token) {
    return { prisma, authenticatedUser: null }
  }

  const userId = verifyToken(token)

  if (!userId) {
    return { prisma, authenticatedUser: null }
  }

  const authenticatedUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  })

  return { prisma, authenticatedUser }
}
