import { appRouter } from '../server/routers/_app'
import { generateOpenApiDocument } from 'trpc-openapi'

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'Example CRUD API',
  description: 'OpenAPI compliant REST API built using tRPC with Next.js',
  version: '1.0.0',
  baseUrl: 'http://localhost:3000/api',
  docsUrl: 'https://github.com/gmazoni/3t-plus',
  tags: ['auth', 'users', 'posts'],
})
