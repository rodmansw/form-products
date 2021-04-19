declare namespace NodeJS {
  interface ProcessEnv {
    DB_HOST: string
    DB_PORT: number
    DB_USER: string
    DB_PASSWORD: string
    DB_NAME: string
    PORT: number
    NODE_ENV: 'development' | 'production' | 'test'
    RUN_SEED: boolean
  }
}

declare module '*.json' {
  const value: any
  export default value
}

interface IndexObject<T = any> {
  [key: string]: T
}
