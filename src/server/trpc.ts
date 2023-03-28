import { Context } from './context'
import { TRPCError, initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { OpenApiMeta } from 'trpc-openapi'

const t = initTRPC
  .meta<OpenApiMeta>()
  .context<Context>()
  .create({
    transformer: superjson,
    errorFormatter({ shape }) {
      return {
        ...shape,
        data: {
          ...shape.data,
        },
      }
    },
  })

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    })
  }
  return next({ ctx })
})

const loggerMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now()
  const result = await next()
  const durationMs = Date.now() - start
  result.ok
    ? console.log('OK request timing:', { path, type, durationMs })
    : console.log('Non-OK request timing', { path, type, durationMs })
  return result
})

export const router = t.router
export const middleware = t.middleware

export const publicProcedure = t.procedure.use(loggerMiddleware)
export const protectedProcedure = t.procedure.use(isAuthed).use(loggerMiddleware)
