import http from 'node:http'

import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@as-integrations/express5'
import cors from 'cors'
import express from 'express'

import { createContext, type GraphQLContext } from './graphql/context.js'
import { depthLimit } from './graphql/depth-limit.js'
import { resolvers } from './graphql/resolvers/index.js'
import { typeDefs } from './graphql/schema/index.js'
import { env } from './lib/env.js'
import { apiRateLimit, authRateLimit, securityHeaders } from './lib/security.js'

const isProduction = env.NODE_ENV === 'production'

const app = express()

app.disable('x-powered-by')

const httpServer = http.createServer(app)

const apolloServer = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),

    ...(isProduction ? [ApolloServerPluginLandingPageDisabled()] : []),
  ],

  introspection: !isProduction,

  validationRules: [depthLimit(8)],
})

await apolloServer.start()

app.use(securityHeaders)

app.use(
  cors({
    origin: '*',
  }),
)

app.use(express.json({ limit: '100kb' }))

app.get('/health', (_request, response) => {
  response.json({
    status: 'ok',
    environment: env.NODE_ENV,
    uptime: process.uptime(),
  })
})

app.use(
  '/graphql',
  apiRateLimit,
  authRateLimit,
  expressMiddleware(apolloServer, { context: createContext }),
)

await new Promise<void>((resolve) => {
  httpServer.listen(3333, resolve)
})

console.log(`API iniciada em http://localhost:3333`)
