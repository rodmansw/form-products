import { Pool, Client } from 'pg'
import pgCamelCase from 'pg-camelcase'

/**
 * DOCS:
 *  https://node-postgres.com/features/pooling
 */
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

pool.on('error', error => {
  console.error('Un cliente inactivo ha experimentado un error.', error.stack)
})

pgCamelCase.inject(Client)

pool
  .query('SELECT NOW()')
  .then(res => console.info(((res || {}).rows || [])[0]))
  .catch(error => console.error(error))

export const pg = {
  /**
   * DB Query
   * @param {object} req
   * @param {object} res
   * @returns {object} object { rows: array }
   */
  query<T = any>(rawQuery: string, params: any[] = []) {
    return new Promise<{ rows: T[] }>((resolve, reject) => {
      pool
        .query(rawQuery, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    }).catch(error => {
      throw new Error(error)
    })
  }
}
