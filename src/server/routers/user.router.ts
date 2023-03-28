import { protectedProcedure, publicProcedure, router } from '../trpc'
import { createUserSchema, deleteUserSchema, paginationSchema } from '@/schemas/user.schema'
import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'

export const userRouter = router({
  'register-user': publicProcedure.input(createUserSchema).mutation(async ({ input, ctx }) => {
    const { email, name } = input

    const user = await ctx.prisma.user.create({
      data: {
        email,
        name,
      },
    })

    return user
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.session
  }),

  'delete-user': protectedProcedure.input(deleteUserSchema).mutation(async ({ ctx, input }) => {
    const { email } = input

    if (ctx?.session?.user?.email === email) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Can not delete yourself',
      })
    }

    await ctx.prisma.user.delete({
      where: {
        email,
      },
    })

    return true
  }),

  list: protectedProcedure.input(paginationSchema).query(async ({ input, ctx }) => {
    const { page, perPage, search } = input

    const where: Prisma.UserWhereInput = {
      OR: [{ name: { contains: search ?? '' } }, { email: { contains: search ?? '' } }],
    }

    const users = await ctx.prisma.user.findMany({
      skip: perPage * (page - 1),
      take: perPage,
      where,
      select: {
        email: true,
        name: true,
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
