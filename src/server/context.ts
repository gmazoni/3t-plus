import { cache } from '@/utils/cache'
import { prisma } from '@/utils/prisma'
import { queues } from '@/utils/processing/queues'
import { unleash } from '@/utils/unleash'
import { createId } from '@paralleldrive/cuid2'
import { UserRole } from '@prisma/client'
import type { inferAsyncReturnType } from '@trpc/server'
import type { CreateNextContextOptions } from '@trpc/server/adapters/next'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'

export async function createContext(opts: CreateNextContextOptions) {
  const requestId = createId()
  opts.res.setHeader('X-Request-Id', requestId)

  const session = await getSession({ req: opts.req })

  const getUserRole = () => {
    return session?.user?.role ?? ('' as UserRole | '')
  }

  return { ...opts, getUserRole, session, prisma, cache, queues, unleash, requestId }
}

export async function createContextAPI(opts: CreateNextContextOptions) {
  const requestId = createId()
  opts.res.setHeader('X-Request-Id', requestId)

  try {
    if (opts.req.headers.authorization) {
      const key = opts.req.headers.authorization.split(' ')[1]

      const apikey = await prisma.apiKey.findFirst({
        where: {
          key,
          enabled: true,
        },
        include: {
          user: {
            select: {
              email: true,
              name: true,
              image: true,
              role: true,
            },
          },
        },
      })

      if (!apikey) opts.res.status(428).send({ message: 'Invalid API key' })

      await prisma.apiKey.update({
        where: {
          id: apikey?.id,
        },
        data: {
          lastUsedAt: new Date(),
        },
      })

      if (apikey?.user) {
        const session = {
          user: apikey.user,
          expires: '9999-12-31T23:59:59.999Z',
        } as Session

        const getUserRole = () => {
          return session?.user?.role ?? ('' as UserRole | '')
        }

        return {
          ...opts,
          getUserRole,
          session,
          prisma,
          cache,
          queues,
          unleash,
          requestId,
        }
      }
    }
  } catch (err) {
    console.error(err)
  }

  opts.res.status(401)

  return { ...opts, getUserRole: () => '' as UserRole | '', session: null, prisma, cache, queues, unleash, requestId }
}

export type Context = inferAsyncReturnType<typeof createContext>
