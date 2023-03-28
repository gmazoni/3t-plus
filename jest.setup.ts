import { prisma } from '@/utils/prisma'
import '@testing-library/jest-dom'

export async function truncateDB() {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`

  for (const { tablename } of tablenames) {
    if (tablename !== '_prisma_migrations') {
      try {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`)
      } catch (error) {
        console.log({ error })
      }
    }
  }
}

global.beforeEach(async () => {
  await truncateDB()
})

global.afterEach(async () => {
  await truncateDB()
})
