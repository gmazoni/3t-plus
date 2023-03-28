import z from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(1, "Can't be empty").max(256, 'Too long title'),
  body: z.string().min(10, 'Please write more than 10 characters'),
})

export type CreatePostInput = z.TypeOf<typeof createPostSchema>

export const getSinglePostSchema = z.object({
  postId: z.string().cuid(),
})
