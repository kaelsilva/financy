import type { Request, RequestHandler } from 'express'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'

import { env } from './env.js'

const isProduction = env.NODE_ENV === 'production'

export const securityHeaders: RequestHandler = helmet({
  contentSecurityPolicy: isProduction
    ? {
        directives: {
          defaultSrc: ["'none'"],
          frameAncestors: ["'none'"],
        },
      }
    : false,
  crossOriginEmbedderPolicy: false,
})

export const apiRateLimit: RequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: rateLimitResponse(
    'Muitas requisições. Aguarde alguns minutos e tente de novo.',
  ),
})

const AUTH_FIELD = /\bsign(?:In|Up)\s*\(/

function isAuthOperation(request: Request): boolean {
  const query: unknown = request.body?.query
  return typeof query === 'string' && AUTH_FIELD.test(query)
}

export const authRateLimit: RequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  skip: (request) => !isAuthOperation(request),
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: rateLimitResponse(
    'Muitas tentativas de acesso. Aguarde alguns minutos e tente de novo.',
  ),
})

function rateLimitResponse(message: string) {
  return {
    errors: [{ message, extensions: { code: 'TOO_MANY_REQUESTS' } }],
  }
}
