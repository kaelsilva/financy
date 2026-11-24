import jwt, { type SignOptions } from 'jsonwebtoken'

import { env } from './env.js'

export function signToken(userId: string): string {
  return jwt.sign({}, env.JWT_SECRET, {
    subject: userId,

    expiresIn: '3d' as SignOptions['expiresIn'],
  })
}

export function verifyToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET)

    if (typeof payload === 'string' || !payload.sub) {
      return null
    }

    return payload.sub
  } catch {
    return null
  }
}
