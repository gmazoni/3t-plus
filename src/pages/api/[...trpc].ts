import { createContextAPI } from '../../server/context'
import { appRouter } from '../../server/routers/_app'
import { NextApiRequest, NextApiResponse } from 'next'
import cors from 'nextjs-cors'
import { createOpenApiNextHandler } from 'trpc-openapi'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res)

  return createOpenApiNextHandler({
    router: appRouter,
    createContext: createContextAPI,
  })(req, res)
}

export default handler
