import format from 'pg-format'

import { pg } from '../utils/db'
import jsonFile from './products.json'

export async function runSeed() {
  try {
    const { rows } = await pg.query<{ exists: boolean }>(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE  table_schema = 'public'
        AND    table_name   = 'products'
      );
    `)

    if (!rows[0]?.exists) {
      console.log('RUNNING SEEDS...')

      await pg.query(`
        CREATE TABLE public.products
        (
          code character varying(600) NOT NULL,
          position integer NOT NULL,
          quantity integer NOT NULL,
          image character varying(600),
          price numeric NOT NULL,
          description character varying(600) NOT NULL,
          CONSTRAINT products_pkey PRIMARY KEY (code)
        )
      `)

      const { rows } = await pg.query(
        format(
          `
            INSERT INTO public.products (
              code, position, quantity, image, price,
              description
            ) VALUES %L
          `,
          jsonFile.products.map((product: Product) => [
            product.code,
            product.position,
            product.quantity,
            product.image,
            product.price,
            product.description
          ])
        )
      )

      console.log('DONE RUNNING SEEDS!! 🚀🚀')
      return rows
    }
  } catch (error) {
    console.log('ERROR RUNNING SEEDS!!')
    console.log(error)
  }
}
