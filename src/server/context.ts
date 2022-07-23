import { verifyJwt } from '@/utils/jwt'
import { prisma } from '@/utils/prisma'
import type { inferAsyncReturnType } from '@trpc/server'
import type { CreateNextContextOptions } from '@trpc/server/adapters/next'
import { NextApiRequest } from 'next'

async function getUserFromRequest(req: NextApiRequest) {
  const token = req.cookies.token

  if (token) {
    try {
      const verified = await verifyJwt(token)
      return verified
    } catch (e) {
      return null
    }
  }

  return null
}

export async function createContext(opts: CreateNextContextOptions) {
  const user = await getUserFromRequest(opts.req)

  return { ...opts, user, prisma }
}

export type Context = inferAsyncReturnType<typeof createContext>
