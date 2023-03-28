import { createUserFactory } from '../generated'
import { faker } from '@faker-js/faker'

export const UserFactory = createUserFactory({
  email: faker.internet.email(),
})
