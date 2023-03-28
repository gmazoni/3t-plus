import './workers'
import { cache as connection } from '@/utils/cache'
import { Queue } from 'bullmq'

export const queues = global.queues || {
  email: new Queue('email', { connection, defaultJobOptions: { removeOnComplete: true } }),
}

if (process.env.NODE_ENV !== 'production') {
  global.queues = queues
}
