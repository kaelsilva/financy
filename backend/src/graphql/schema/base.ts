export const baseTypeDefs = `#graphql
  """Data e hora no formato ISO-8601, sempre em UTC."""
  scalar DateTime
  """Inteiro de ate 2^53 - 1. Usado em somas de valores em centavos."""
  scalar SafeInt

  type Query {
    """Verifica se a API GraphQL esta respondendo."""
    hello: String!
  }
`
