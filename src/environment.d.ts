declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      NEXTAUTH_SECRET: string
      NEXTAUTH_URL_INTERNAL: string
      NEXTAUTH_URL: string
      SMTP_HOST: string
      SMTP_PORT: string
      SMTP_USER: string
      SMTP_PASS: string
      DATABASE_URL: string
      REDIS_URL: string
      EMAIL_FROM: string
      UNLEASH_URL: string
      UNLEASH_APP_NAME: string
      UNLEASH_INSTANCE_ID: string
    }
  }
}

export {}
