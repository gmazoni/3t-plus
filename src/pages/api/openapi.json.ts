import { openApiDocument } from '../../server/openapi'
import { NextApiRequest, NextApiResponse } from 'next'

// Respond with our OpenAPI schema
const handler = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send(openApiDocument)
}

export default handler
