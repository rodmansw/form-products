import { ProductsResolvers, ProductType } from './products'
import { RootQuery } from './root'
import { mergeDeep } from '../utils/utils'

export const typeDefs = [RootQuery, ProductType]

export const resolvers = mergeDeep(ProductsResolvers)
