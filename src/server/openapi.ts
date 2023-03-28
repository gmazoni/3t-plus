import { appRouter } from '../server/routers/_app'
import { baseUrl } from '@/constants'
import { generateOpenApiDocument } from 'trpc-openapi'

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'App API',
  description: 'OpenAPI compliant REST API built using tRPC with Next.js',
  version: '1.0.0',
  baseUrl: baseUrl + '/api',
  tags: ['posts'],
})
