import { cache as connection } from '@/utils/cache'
import { Worker } from 'bullmq'
import nodemailer from 'nodemailer'

export const workers = global.workers || {
  email: new Worker(
    'email',
    async ({ data }) => {
      const { to, subject, html, text } = data

      console.info(`Sending email...`)

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PORT,
        },
      })

      const response = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
        text,
      })

      console.info(`Email sent: ${response.messageId}`)
    },
    { connection }
  ),
}

if (process.env.NODE_ENV !== 'production') {
  global.workers = workers
}
