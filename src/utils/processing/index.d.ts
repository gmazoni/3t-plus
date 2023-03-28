import { Queue, Worker } from 'bullmq'

type Queues = Record<string, Queue>
type Workers = Record<string, Worker>

declare global {
  // eslint-disable-next-line no-var
  var queues: Queues | undefined
  // eslint-disable-next-line no-var
  var workers: Workers | undefined
}
