import { protectedProcedure, publicProcedure, router } from '../trpc'
import { baseUrl } from '@/constants'
import {
  createUserSchema,
  deleteUserSchema,
  paginationSchema,
  requestOtpSchema,
  verifyOtpSchema,
} from '@/schemas/user.schema'
import { decode, encode } from '@/utils/base64'
import { signJwt } from '@/utils/jwt'
import { sendLoginEmail } from '@/utils/mailer'
import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { serialize } from 'cookie'
import { z } from 'zod'

export const userRouter = router({
  'register-user': publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/register',
        tags: ['users'],
      },
    })
    .input(createUserSchema)
    .output(
      z.object({
        id: z.string().uuid(),
        email: z.string().email(),
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { email, name } = input

      const user = await ctx.prisma.user.create({
        data: {
          email,
          name,
        },
      })

      return user
    }),

  'request-otp': publicProcedure.input(requestOtpSchema).mutation(async ({ input, ctx }) => {
    const { email } = input

    const user = await ctx.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      })
    }

    const token = await ctx.prisma.token.create({
      data: {
        email,
      },
    })

    sendLoginEmail({
      token: encode(token.id),
      url: baseUrl,
      email,
    })

    return true
  }),

  'verify-otp': publicProcedure.input(verifyOtpSchema).query(async ({ input, ctx }) => {
    const id = decode(input.hash)

    const token = await ctx.prisma.token.findUnique({
      where: {
        id,
      },
    })

    if (!token) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Invalid token',
      })
    }

    const user = await ctx.prisma.user.findUnique({
      where: {
        email: token.email,
      },
    })

    const jwt = await signJwt({
      id: user?.id ?? '',
      email: token.email,
    })

    await ctx.prisma.token.delete({
      where: {
        id,
      },
    })

    ctx.res.setHeader(
      'Set-Cookie',
      `token=${jwt}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toUTCString()}`
    )

    return true
  }),

  logout: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user) {
      await ctx.prisma.token.deleteMany({
        where: {
          email: ctx?.user?.email ?? '',
        },
      })
    }

    ctx.res.setHeader('Set-Cookie', serialize('token', '', { path: '/' }))
    return true
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user
  }),

  'delete-user': protectedProcedure.input(deleteUserSchema).mutation(async ({ ctx, input }) => {
    const { id } = input

    if (ctx?.user?.id == id) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Can not delete yourself',
      })
    }

    await ctx.prisma.user.delete({
      where: {
        id,
      },
    })

    return true
  }),
  list: protectedProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/list',
        tags: ['users'],
      },
    })
    .output(
      z.object({
        users: z.array(
          z.object({
            id: z.string(),
            email: z.string(),
            name: z.string(),
            updatedAt: z.date(),
          })
        ),
        total: z.number(),
      })
    )
    .input(paginationSchema)
    .query(async ({ input, ctx }) => {
      const { page, perPage, search } = input

      const where: Prisma.UserWhereInput = {
        OR: [{ name: { contains: search ?? '' } }, { email: { contains: search ?? '' } }],
      }

      const users = await ctx.prisma.user.findMany({
        skip: perPage * (page - 1),
        take: perPage,
        where,
        select: {
          id: true,
          email: true,
          name: true,
          updatedAt: true,
        },
      })

      const total = await ctx.prisma.user.count({
        where,
      })

      return {
        users,
        total,
      }
    }),
})
