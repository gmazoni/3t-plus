import { createPostFactory, createUserFactory } from '../generated'
import { faker } from '@faker-js/faker'

export const PostFactory = createPostFactory({
  title: faker.lorem.words(5),
  body: faker.lorem.paragraphs(5),
  user: {
    create: () =>
      createUserFactory({
        email: faker.internet.email(),
      }).build(),
  },
})
