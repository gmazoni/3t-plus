// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@teste.com',
      },
    })

    console.log('User created')
  } catch (e) {
    console.error(e)
  }
}

main()
