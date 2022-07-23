import { protectedProcedure, publicProcedure, router } from '../trpc'
import { createPostSchema, getSinglePostSchema } from '@/schemas/post.schema'
import { z } from 'zod'

export const postRouter = router({
  'create-post': protectedProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/create-post',
        tags: ['posts'],
      },
    })
    .output(
      z.object({
        id: z.string().uuid(),
        title: z.string(),
        body: z.string(),
      })
    )
    .input(createPostSchema)
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.post.create({
        data: {
          ...input,
          user: {
            connect: {
              id: (ctx?.user?.id ?? '') as string,
            },
          },
        },
      })
    }),
  all: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/all',
        tags: ['posts'],
      },
    })
    .input(z.object({}))
    .output(
      z.array(
        z.object({
          id: z.string().uuid(),
          title: z.string(),
          body: z.string(),
        })
      )
    )
    .query(async ({ ctx }) => {
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
          id: z.string().uuid(),
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
