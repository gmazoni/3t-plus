import { protectedProcedure, router } from '../trpc'
import { createPostSchema, getSinglePostSchema } from '@/schemas/post.schema'
import { UserRole } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const postRouter = router({
  'create-post': protectedProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/create-post',
        tags: ['posts'],
        protect: true,
      },
    })
    .input(createPostSchema)
    .output(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.getUserRole() !== UserRole.ADMIN)
        throw new TRPCError({
          message: 'You are not allowed to create posts',
          code: 'FORBIDDEN',
        })

      await ctx.cache.del('query:posts')

      return await ctx.prisma.post.create({
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

  all: protectedProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/all',
        tags: ['posts'],
        protect: true,
      },
    })
    .input(z.object({}))
    .output(
      z.array(
        z.object({
          id: z.string().cuid(),
          title: z.string(),
          body: z.string(),
        })
      )
    )
    .query(async ({ ctx }) => {
      const posts = await ctx.cache.get('query:posts')

      if (posts) {
        return JSON.parse(posts)
      }

      const allPosts = await ctx.prisma.post.findMany()

      await ctx.cache.setex('query:posts', 60, JSON.stringify(allPosts))

      return allPosts
    }),

  'single-post': protectedProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/single-post',
        tags: ['posts'],
        protect: true,
      },
    })
    .input(getSinglePostSchema)
    .output(
      z
        .object({
          id: z.string().cuid(),
          title: z.string(),
          body: z.string(),
        })
        .nullable()
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.post.findUnique({
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
