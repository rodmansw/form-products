import { gql } from 'apollo-server-express'

export const RootQuery = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`
