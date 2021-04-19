import { gql } from 'apollo-server-express'
import { pg } from '../utils/db'

export const ProductType = gql`
  type Product {
    code: String!
    position: Int
    quantity: Int
    image: String
    price: Int
    description: String
  }

  input ProductInput {
    code: String!
    position: Int!
    quantity: Int!
    image: String
    price: Int!
    description: String!
  }

  extend type Query {
    products(searchTerm: String): [Product]!
  }

  extend type Mutation {
    insertProduct(product: ProductInput!): Product!
    updateProduct(code: String!, product: ProductInput!): Product
    deleteProduct(code: String!): Product
  }
`

export const ProductsResolvers = {
  Query: {
    async products(_: any, args: { searchTerm: string }): Promise<Product[]> {
      const { searchTerm } = args
      let queryString = 'SELECT * FROM public.products '

      if (searchTerm) {
        queryString += `WHERE code ILIKE $1 OR description ILIKE $1`
      }

      const { rows } = await pg.query<Product>(queryString, searchTerm ? [`%${searchTerm}%`] : [])
      return rows
    }
  },
  Mutation: {
    async insertProduct(_: any, args: { product: Product }): Promise<Product> {
      const { product } = args
      const { rows } = await pg.query<Product>(
        `
          INSERT INTO public.products (
            code, position, quantity, image, price,
            description
          ) VALUES($1, $2, $3, $4, $5, $6) RETURNING *
        `,
        [
          product.code,
          product.position,
          product.quantity,
          product.image,
          product.price,
          product.description
        ]
      )

      return await rows[0]
    },
    async updateProduct(_: any, args: { code: string; product: Product }): Promise<Product> {
      const { code, product } = args
      const { rows } = await pg.query<Product>(
        `
          UPDATE public.products
            SET code = $2, position = $3, quantity = $4,
            image = $5, price = $6, description = $7
            WHERE code = $1
          RETURNING *
        `,
        [
          code,
          product.code,
          product.position,
          product.quantity,
          product.image,
          product.price,
          product.description
        ]
      )

      return await rows[0]
    },
    async deleteProduct(_: any, args: { code: string }): Promise<Product> {
      const { code } = args
      const { rows } = await pg.query<Product>(
        `
          DELETE FROM public.products WHERE code = $1
          RETURNING *
        `,
        [code]
      )

      return await rows[0]
    }
  }
}
