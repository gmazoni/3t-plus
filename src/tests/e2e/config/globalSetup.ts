import { prisma } from '@/utils/prisma'
import { chromium, expect } from '@playwright/test'
import { UserRole } from '@prisma/client'

const APP_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

async function globalSetup() {
  await prisma.$connect()

  await prisma.verificationToken.deleteMany()
  await prisma.user.deleteMany()

  const tokens = {
    ADMIN: {
      token: '5206799bfd604b356d534ac5a191450b9cba84ff6def05ebedb753a461c86994',
      callback_code: 'd694e9e566d8a4a37b255f200f9db28e3dc392acf2df2de1ee0e40da8214ddd3',
    },
    SUPERVISOR: {
      token: '4206380b2ebe1edea99abefd30f171433cfe97262a9d417a395eacf0f218ec13',
      callback_code: 'dc6d12fe77cf254103c04bfa60b18cefbf4095ead144f99db6ad9c39d041d6cf',
    },
    USER: {
      token: 'a7a64713bdd894dd51bc3f8d6aec8edf15791b1b11dbf3a332e67f32bc8a942b',
      callback_code: '1c3b06e52be023e7a46e9d387c616e09f4d914fcb627b6e08284694f1cecca2a',
    },
  }

  await prisma.user.createMany({
    data: Object.keys(tokens).map((key) => ({
      role: key as UserRole,
      name: `Some ${key.toLocaleLowerCase()}`,
      email: `${key.toLowerCase()}@bar.com`,
    })),
  })

  const expires = new Date(new Date().getTime() + 60 * 60 * 1000)
  await prisma.verificationToken.createMany({
    data: Object.keys(tokens).map((key) => ({
      token: tokens[key].token,
      expires: expires.toISOString(),
      identifier: `${key.toLowerCase()}@bar.com`,
    })),
  })

  const browser = await chromium.launch()
  for (const authUser of ['ADMIN', 'SUPERVISOR', 'USER']) {
    const page = await browser.newPage()

    await page.context().clearCookies()

    await page.goto(
      `${APP_URL}/api/auth/callback/email?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F&token=${
        tokens[authUser].callback_code
      }&email=${authUser.toLowerCase()}${encodeURIComponent('@bar.com')}`
    )

    await page.context().storageState({ path: `states/${authUser}_STATE.json` })

    await page.waitForLoadState('networkidle')

    expect(page.url()).toBe(`${APP_URL}/`)
  }
  await browser.close()
}

export default globalSetup
