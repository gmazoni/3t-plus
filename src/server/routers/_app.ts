import { router } from '../trpc'
import { postRouter } from './post.router'
import { userRouter } from './user.router'

export const appRouter = router({
  posts: postRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter
