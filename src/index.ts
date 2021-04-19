import dotenv from 'dotenv'
dotenv.config()

import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import express from 'express'
import { typeDefs, resolvers } from './schema/index'
import { runSeed } from './seed/seed'

const PORT = process.env.PORT || 4000

async function startApolloServer() {
  const app = express()
  app.use(cors({ maxAge: 86400 }))

  app.use('/api', (req, res) => {
    res.status(200)
    res.send('Hello!')
    res.end()
  })

  app.use('/api/static', express.static(__dirname + '/public'))

  app.use('/api/seed', async (req, res) => {
    const rows = await runSeed()
    res.status(200)
    res.json(rows)
    res.end()
  })

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true
  })

  await server.start()

  server.applyMiddleware({ app, path: '/api/graphql' })

  await new Promise(resolve => app.listen({ port: PORT }, resolve as () => void))
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)

  if (process.env.RUN_SEED) {
    await runSeed()
  }

  return { server, app }
}

startApolloServer()
