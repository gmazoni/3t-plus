import { prisma } from '@/utils/prisma'

async function globalTeardown() {
  await prisma.post.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.$disconnect()
}

export default globalTeardown
