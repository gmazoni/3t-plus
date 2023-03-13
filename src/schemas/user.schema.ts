import z from 'zod'

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1, { message: 'Please give a name' }).max(50, { message: 'Name is too long' }),
})

export type CreateUserInput = z.TypeOf<typeof createUserSchema>

export const deleteUserSchema = z.object({
  email: z.string(),
})

export type DeleteUserInput = z.TypeOf<typeof deleteUserSchema>

export const paginationSchema = z.object({
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(10),
  search: z.string().optional(),
})

export type PaginationInput = z.TypeOf<typeof paginationSchema>
