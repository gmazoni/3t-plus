import { prisma } from '@/utils/prisma'
import { queues } from '@/utils/processing/queues'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { UserRole } from '@prisma/client'
import NextAuth, { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { z } from 'zod'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user }) {
      const { email } = user

      const dbUser = await prisma.user.findUnique({
        where: {
          email: email as string,
        },
      })

      if (!dbUser) return false

      return true
    },
    async jwt({ token, user }) {
      if (!user) return token // User object only passed on initial JWT creation

      const dbUser = await prisma.user.findUnique({
        where: {
          email: user?.email as string,
        },
      })

      if (!dbUser) return token

      return {
        ...token,
        role: dbUser.role,
      }
    },
    async session({ session, token }) {
      session.user.role = token.role as UserRole
      return session
    },
  },
  providers: [
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async (params) => {
        const { identifier, url } = params

        const email = z.coerce.string().email().safeParse(identifier)

        if (!email.success) return

        const { host } = new URL(url)

        await queues.email.add('email', {
          to: email.data,
          subject: `Sign in to ${host}`,
          text: text({ url, host }),
          html: html({ url, host }),
        })
      },
    }),
  ],
}

export default NextAuth(authOptions)

function html(params: { url: string; host: string }) {
  const { url, host } = params

  const escapedHost = host.replace(/\./g, '&#8203;.')

  const brandColor = '#346df1'
  const color = {
    background: '#f9f9f9',
    text: '#444',
    mainBackground: '#fff',
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: '#fff',
  }

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Sign in to <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
                in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`
}

declare module 'next-auth' {
  interface User {
    role: UserRole
  }

  interface Session {
    user: User
  }
}
