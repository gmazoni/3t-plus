import { PostFactory } from '@/factories/post'
import { prisma } from '@/utils/prisma'

describe('factories and test infrastructure', () => {
  it('calls a post factory to validate migrations and test db', async () => {
    await PostFactory.create()

    const postCount = await prisma.post.count()

    expect(postCount).toBe(1)
  })

  it('calls a post factory twice to validate purge between tests', async () => {
    await PostFactory.create()
    await PostFactory.create()

    const postCount = await prisma.post.count()

    expect(postCount).toBe(2)
  })
})
