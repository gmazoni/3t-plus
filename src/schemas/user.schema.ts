import z from 'zod'

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1, { message: 'Please give a name' }).max(50, { message: 'Name is too long' }),
})

export type CreateUserInput = z.TypeOf<typeof createUserSchema>

export const deleteUserSchema = z.object({
  id: z.string(),
})

export const requestOtpSchema = z.object({
  email: z.string().email(),
})

export type requestOtpInput = z.TypeOf<typeof requestOtpSchema>

export const verifyOtpSchema = z.object({
  hash: z.string(),
})

export const paginationSchema = z.object({
  page: z.number(),
  perPage: z.number(),
  search: z.string().optional(),
})

export type PaginationInput = z.TypeOf<typeof paginationSchema>
