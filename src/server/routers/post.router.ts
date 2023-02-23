import { protectedProcedure, publicProcedure, router } from '../trpc'
import { createPostSchema, getSinglePostSchema } from '@/schemas/post.schema'
import { z } from 'zod'

export const postRouter = router({
  'create-post': protectedProcedure.input(createPostSchema).mutation(async ({ input, ctx }) => {
    return ctx.prisma.post.create({
      data: {
        ...input,
        user: {
          connect: {
            email: ctx.session?.user?.email as string,
          },
        },
      },
    })
  }),
  all: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.post.findMany()
  }),
  'single-post': publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/single-post',
        tags: ['posts'],
      },
    })
    .output(
      z
        .object({
          id: z.string().cuid(),
          title: z.string(),
          body: z.string(),
        })
        .nullable()
    )
    .input(getSinglePostSchema)
    .query(async ({ input, ctx }) => {
      return ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
        select: {
          id: true,
          title: true,
          body: true,
        },
      })
    }),
})
