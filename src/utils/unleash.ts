import { Unleash } from 'unleash-client'

declare global {
  // eslint-disable-next-line no-var
  var unleash: Unleash | undefined
}

export const unleash =
  global.unleash ||
  (process.env.UNLEASH_URL
    ? new Unleash({
        url: process.env.UNLEASH_URL,
        instanceId: process.env.UNLEASH_INSTANCE_ID,
        refreshInterval: 1000,
        appName: process.env.UNLEASH_APP_NAME,
      })
    : undefined)

if (process.env.NODE_ENV !== 'production') {
  global.unleash = unleash
}
