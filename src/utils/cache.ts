import IORedis from 'ioredis'

declare global {
  // eslint-disable-next-line no-var
  var cache: IORedis | undefined
}

export const cache =
  global.cache ||
  new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
  })

if (process.env.NODE_ENV !== 'production') {
  global.cache = cache
}
